import { SERVICE_WORKER_ACTIVE } from './config';
import { log } from './log';

let serviceWorker: Promise<ServiceWorkerRegistration>;

// If service workers are enabled and supported by the browser
// register the service worker here
// The service worker will then run independently in the background of the browser
// (thus lifecycle mangement is slightly more complex)
if (SERVICE_WORKER_ACTIVE && 'serviceWorker' in navigator) {
    serviceWorker = navigator.serviceWorker.register('/service-worker.js');
    log('ServiceWorker', 'Service Worker registered');
}

// If a service worker is active, one can get it here
export function getServiceWorker() {
    return serviceWorker;
}
