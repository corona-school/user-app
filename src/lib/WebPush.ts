import { useApolloClient, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { log } from '../log';
import { getServiceWorker } from '../service-worker-proxy';
import { useEffect, useState } from 'react';

// ------------ Utilities --------------------

async function base64ToUint8Array(base64: string) {
    var dataUrl = 'data:application/octet-binary;base64,' + base64;

    return new Uint8Array(await (await fetch(dataUrl)).arrayBuffer());
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
        applicationServerKey: await base64ToUint8Array(serverKey),
    };

    log('WebPush', 'Creating Push Subscription');
    const pushSubscription = await sw.pushManager.subscribe(subscribeOptions);

    log('WebPush', 'Received Push Subscription: ', pushSubscription);
    return {
        endpoint: pushSubscription.endpoint,
        expirationTime: (pushSubscription as any).expirationTime,
        keys: {
            auth: pushSubscription.getKey('auth'),
            p256dh: pushSubscription.getKey('p256dh'),
        },
    };
}

// ------------ Hook --------------------

export function useWebPush() {
    const client = useApolloClient();
    const [status, setStatus] = useState<'loading' | 'not-supported' | 'user-denied' | 'ask-user' | 'not-subscribed' | 'subscribed'>('loading');

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

            setStatus('subscribed');
        })();
    }, []);

    async function subscribe() {
        setStatus('loading');

        const granted = await userGrantsWebpushPermission();
        if (!granted) return;

        const {
            data: { pushPublicKey },
        } = await client.query({
            query: gql(`
            query GetPushPublicKey {
                pushPublicKey
            }
        `),
        });

        if (!pushPublicKey) {
            log('WebPush', 'Missing Server Public Key');
            return;
        }

        const subscription = await subscribeUserToPush(pushPublicKey);
        if (!subscription) {
            return;
        }

        await client.mutate({
            mutation: gql(`
                mutation AddSubscription($subscription: CreatePushSubscriptionInput!) {
                    userPushSubcriptionAdd(subscription: $subscription)
                }
            `),
            variables: { subscription },
        });

        setStatus('subscribed');
    }

    return { status, subscribe };
}
