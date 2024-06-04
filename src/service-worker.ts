// THIS IS A SERVICE WORKER!
// Consider this a completely separate application,
// which runs in the background in the browser and which can communicate
// with open windows running the web app
// Be careful what you include here!

import { precacheAndRoute } from 'workbox-precaching';

const swSelf = self as any as ServiceWorkerGlobalScope;

// ------- Service Worker Initialization -----
console.log('Starting Service Worker');

// --- Caching ---
// The Workbox plugin injects a list of files from the Webpack build here,
// these files are then cached
// @ts-ignore
const manifest = self.__WB_MANIFEST;
// TODO: When someone requests /welcome etc., answer with index.html
precacheAndRoute(manifest);
console.log('Caching the following files', manifest);

// --- Push ---
// Show Notifications
swSelf.addEventListener('push', (event) => {
    console.log('Triggering Push Event', event);

    const pushData = event.data!.json();
    console.log('Got message', pushData);

    const {
        message: { headline, body, navigateTo },
    } = pushData as { message: { headline: string; body: string; navigateTo: string } };

    const notificationChain = swSelf.registration.showNotification(headline, {
        icon: './favicons/apple-touch-icon.png',
        badge: './favicons/apple-touch-icon.png',
        body,
        data: { navigateTo },
    });

    (event as any).waitUntil(notificationChain);
});

// Handle Notification Click
swSelf.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked', event.notification.tag, event.notification.data);
    event.notification.close();

    const { navigateTo } = event.notification.data;

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        swSelf.clients
            .matchAll({
                type: 'window',
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if ('focus' in client) {
                        client.focus();
                        client.navigate(navigateTo);
                        return;
                    }
                }

                return swSelf.clients.openWindow(navigateTo);
            })
    );
});
