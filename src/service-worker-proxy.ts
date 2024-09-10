import { SERVICE_WORKER_ACTIVE } from './config';
import { log } from './log';

// If service workers are enabled and supported by the browser
// register the service worker here
// The service worker will then run independently in the background of the browser
// (thus lifecycle mangement is slightly more complex)
const active = SERVICE_WORKER_ACTIVE && 'serviceWorker' in navigator;
if (active) {
    window.addEventListener('load', function () {
        log('ServiceWorker', 'Starting registration');
        navigator.serviceWorker.register('/service-worker.js').then(
            () => {
                log('ServiceWorker', 'Service Worker registered');
            },
            (reason) => {
                log('ServiceWorker', 'Service Worker registration failed', reason);
            }
        );
    });
}

// If a service worker is active, one can get it here
export async function getServiceWorker() {
    if (!active) return undefined;

    return await navigator.serviceWorker.ready;
}
