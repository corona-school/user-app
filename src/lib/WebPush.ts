import { ApolloClient, useApolloClient, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { log } from '../log';
import { getServiceWorker } from '../service-worker-proxy';
import { useEffect, useState } from 'react';
import { CreatePushSubscriptionInput } from '../gql/graphql';

// ------------ Utilities --------------------

async function base64URLToUint8Array(base64url: string) {
    // Convert Base64URL to Base64 encoding (c.f. https://datatracker.ietf.org/doc/html/rfc4648#section-5)
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode it into an array buffer
    var dataUrl = 'data:application/octet-binary;base64,' + base64;
    return new Uint8Array(await (await fetch(dataUrl)).arrayBuffer());
}

function bufferToBase64URL(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve) => {
        const blob = new Blob([buffer]);
        const reader = new FileReader();

        reader.onload = (event) => {
            const dataUrl = event.target!.result as string;
            const [_, base64] = dataUrl.split(',');
            const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_');

            resolve(base64url);
        };

        reader.readAsDataURL(blob);
    });
}

export async function encodeSubscription(subscription: PushSubscription) {
    const auth = await bufferToBase64URL(subscription.getKey('auth')!);
    const p256dh = await bufferToBase64URL(subscription.getKey('p256dh')!);
    log('WebPush', 'Encoded client key', { auth, p256dh });

    return {
        endpoint: subscription.endpoint,
        expirationTime: (subscription as any).expirationTime,
        keys: {
            auth,
            p256dh,
        },
    };
}

// ------------ WebPush Browser APIs --------------------

export async function userGrantsWebpushPermission() {
    const result = await new Promise<NotificationPermission>(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    });

    log('WebPush', 'Asked user for Permission - ' + result);
    return result === 'granted';
}

export async function subscribeUserToPush(serverKey: string) {
    log('WebPush', 'Registering service worker');

    const sw = await getServiceWorker();
    if (!sw) {
        log('WebPush', 'No service worker present');
        return;
    }

    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: await base64URLToUint8Array(serverKey),
    };

    log('WebPush', 'Creating Push Subscription');
    const pushSubscription = await sw.pushManager.subscribe(subscribeOptions);

    log('WebPush', 'Received Push Subscription: ', pushSubscription);

    return await encodeSubscription(pushSubscription);
}

// ------------ Backend APIs ------------

async function getServerPublicKey(client: ApolloClient<any>) {
    const {
        data: { pushPublicKey },
    } = await client.query({
        query: gql(`
        query GetPushPublicKey {
            pushPublicKey
        }
    `),
    });

    return pushPublicKey;
}

async function subscribeOnServer(client: ApolloClient<any>, subscription: CreatePushSubscriptionInput) {
    await client.mutate({
        mutation: gql(`
            mutation AddSubscription($subscription: CreatePushSubscriptionInput!) {
                userPushSubcriptionAdd(subscription: $subscription)
            }
        `),
        variables: { subscription },
    });
}

async function unsubscribeOnServer(client: ApolloClient<any>, id: number) {
    await client.mutate({
        mutation: gql(`
            mutation RemoveSubscription($id: Int!) {
                userPushSubcriptionRemove(subscriptionID: $id)
            }
        `),
        variables: { id },
    });
}

async function getServerSubscriptions(client: ApolloClient<any>): Promise<{ id: number; endpoint: string }[]> {
    const result = await client.query({
        query: gql(`
            query GetPushSubs {
                me { pushSubscriptions { id endpoint }}
            }              
        `),
    });

    return result.data!.me.pushSubscriptions;
}

// ------------ Hook --------------------

export function useWebPush() {
    const client = useApolloClient();
    const [status, setStatus] = useState<'loading' | 'not-supported' | 'user-denied' | 'ask-user' | 'not-subscribed' | 'subscribed' | 'error'>('loading');
    // The id of the subscription in the backend
    const [subId, setSubId] = useState<number | null>(null);

    useEffect(() => {
        // Supported by browser?
        if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
            setStatus('not-supported');
            return;
        }

        // Do we have a service worker running?
        if (!getServiceWorker()) {
            setStatus('not-supported');
            return;
        }

        // Did the user deny us permissions? If yes,
        // we cannot ask again :/
        if (Notification.permission === 'denied') {
            setStatus('user-denied');
            return;
        }

        // Did the user not yet grant us permission?
        // Then we probably should ask
        if (Notification.permission === 'default') {
            setStatus('ask-user');
            return;
        }

        (async function () {
            const sw = await getServiceWorker();
            const subscription = await sw.pushManager.getSubscription();
            if (!subscription) {
                setStatus('not-subscribed');
                return;
            }

            const serverSubs = await getServerSubscriptions(client);
            const subscribedOnServer = serverSubs.find((it) => it.endpoint === subscription.endpoint);

            if (!subscribedOnServer) {
                // Apparently a previous setup was successful on the client, but failed to reach the server
                log('WebPush', 'Resubsribe on server');

                try {
                    await subscribeOnServer(client, await encodeSubscription(subscription));

                    const serverSubs = await getServerSubscriptions(client);
                    const subscribedOnServer = serverSubs.find((it) => it.endpoint === subscription.endpoint);
                    if (!subscribedOnServer) {
                        log('WebPush', 'Failed to resubscribe');
                        setStatus('error');
                        return;
                    }

                    setSubId(subscribedOnServer.id);
                    setStatus('subscribed');
                } catch (error) {
                    log('WebPush', 'Failed to resubscribe on server', error);
                    setStatus('error');
                    return;
                }
            } else {
                setSubId(subscribedOnServer.id);
                setStatus('subscribed');
            }
        })();
    }, []);

    async function subscribe() {
        setStatus('loading');

        const granted = await userGrantsWebpushPermission();
        if (!granted) return;

        const pushPublicKey = await getServerPublicKey(client);

        if (!pushPublicKey) {
            log('WebPush', 'Missing Server Public Key');
            setStatus('error');
            return;
        }

        const subscription = await subscribeUserToPush(pushPublicKey);
        if (!subscription) {
            setStatus('error');
            return;
        }

        try {
            await subscribeOnServer(client, subscription);
        } catch (error) {
            log('WebPush', 'Failed to subscribe on server', error);
            setStatus('error');
            return;
        }

        setStatus('subscribed');
    }

    async function unsubscribe() {
        if (subId === null) return;

        try {
            await unsubscribeOnServer(client, subId);
            setSubId(null);

            const sw = await getServiceWorker();
            const subscription = await sw.pushManager.getSubscription();
            await subscription?.unsubscribe();

            setStatus('not-subscribed');
            log('WebPush', 'Unsubscribed from WebPush');
        } catch (error) {
            log('WebPush', 'Failed to unsubscribe', error);
            setStatus('error');
        }
    }

    return { status, subscribe, unsubscribe };
}
