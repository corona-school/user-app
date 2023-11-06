import { useEffect } from 'react';

export function useShortcut(shortcut: KeyboardEvent['code'], handler: () => void, deps: any[]) {
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            const cmd = e.altKey || e.metaKey || e.ctrlKey;
            if (cmd && e.code === shortcut) {
                e.preventDefault();
                handler();
            }
        }

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, deps);
}
