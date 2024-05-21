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

    const notificationChain = swSelf.registration.showNotification('Neue Lern-Fair Benachrichtigung', {
        icon: './favicons/apple-touch-icon.png',
        badge: './favicons/apple-touch-icon.png',
        body: 'Öffne die Lern-Fair App um die Benachrichtigung zu sehen',
    });

    (event as any).waitUntil(notificationChain);
});

// Handle Notification Click
swSelf.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked', event.notification.tag);
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        swSelf.clients
            .matchAll({
                type: 'window',
            })
            .then((clientList) => {
                for (const client of clientList) {
                    return client.focus();
                }
                return swSelf.clients.openWindow('/');
            })
    );
});
