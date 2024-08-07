import { useEffect, useState } from 'react';

type UseDebounceArgs<T> = {
    value: T;
    delay: number;
};

const useDebounce = <T,>({ delay, value }: UseDebounceArgs<T>) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

export default useDebounce;
