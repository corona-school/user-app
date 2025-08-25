import { useCallback, useEffect, useState } from 'react';

interface UseLocalStorageArgs<T> {
    key: string;
    initialValue: T;
}

export function useLocalStorage<T>({ key, initialValue }: UseLocalStorageArgs<T>) {
    const serialize = useCallback((value: T) => {
        return JSON.stringify(value);
    }, []);

    const deserialize = useCallback((value: string) => {
        try {
            const parsed = JSON.parse(value);
            return parsed;
        } catch (error) {
            return value;
        }
    }, []);

    const readValue = useCallback((): T => {
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? deserialize(raw) : initialValue;
        } catch (error) {
            return initialValue;
        }
    }, [initialValue, key, deserialize]);

    const [storedValue, setStoredValue] = useState(readValue());

    const setValue = useCallback(
        (value: T) => {
            try {
                window.localStorage.setItem(key, serialize(value));

                setStoredValue(value);

                // Trigger a custom event to notify all uses of the useLocalStorage hook
                window.dispatchEvent(new StorageEvent('local-storage', { key }));
            } catch (error) {
                console.warn(`Error setting localStorage key “${key}”:`, error);
            }
        },
        [key, serialize]
    );

    const removeValue = useCallback(() => {
        window.localStorage.removeItem(key);

        setStoredValue(initialValue);
        // Trigger a custom event to notify all uses of the useLocalStorage hook
        window.dispatchEvent(new StorageEvent('local-storage', { key }));
    }, [initialValue, key]);

    useEffect(() => {
        setStoredValue(readValue());
    }, [key]);

    const handleStorageChange = useCallback(
        (event: StorageEvent | CustomEvent) => {
            if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
                return;
            }
            setStoredValue(readValue());
        },
        [key, readValue]
    );

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, []);

    return [storedValue, setValue, removeValue] as [T, (value: T) => void, () => void];
}
