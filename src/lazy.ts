import { ComponentType, LazyExoticComponent, lazy } from 'react';
import { log } from './log';

const RETRY_COUNT = 3;

export function lazyWithRetry<Component extends ComponentType<any>>(loadModule: () => Promise<{ default: Component }>, options: { prefetch?: boolean } = {}): LazyExoticComponent<Component> {
    if (options.prefetch) {
        // Already load the module now, but only use it if the component is actually rendered
        // Ignore promise rejections (instead of leaving them unhandled)
        loadModule().catch(error => {
            log('Lazy Retry', `Failed to load module in prefetch ${error.message}`);
        });
    }

    async function retry() {
        for (let count = 1; count < RETRY_COUNT; count++) { 
            try {
                return await loadModule();
            } catch(error) {
                log('Lazy Retry', `Failed to load component, retry ${count}: ${(error as Error)?.message}`);
            }
        }

        return await loadModule();
    }

    return lazy(retry);
}

