import { useState, useLayoutEffect } from 'react';

export const useIsOverflow = (ref: React.RefObject<HTMLElement>, callback?: (value: boolean) => void) => {
    const [isOverflow, setIsOverflow] = useState(false);

    useLayoutEffect(() => {
        const { current } = ref;

        const trigger = () => {
            if (!current) return;
            const hasOverflow = current.scrollHeight > current.clientHeight;

            setIsOverflow(hasOverflow);

            if (callback) callback(hasOverflow);
        };

        if (current) {
            trigger();
        }
    }, [callback, ref]);

    return isOverflow;
};
