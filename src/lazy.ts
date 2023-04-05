import { ComponentType, LazyExoticComponent, lazy } from 'react';
import { log } from './log';

const RETRY_COUNT = 3;

export function lazyWithRetry<Component extends ComponentType<any>>(loadModule: () => Promise<{ default: Component }>): LazyExoticComponent<Component> {
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

