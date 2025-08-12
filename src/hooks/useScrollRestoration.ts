import { RefObject, useCallback, useEffect, useLayoutEffect, useState } from 'react';

export function useRestoration({ restore, scrollGroup }: { restore: (id: string) => void; scrollGroup: string }) {
    useLayoutEffect(() => {
        if (window.location.hash.includes(scrollGroup)) {
            const id = window.location.hash
                .split('/')
                .find((it) => it.startsWith(scrollGroup))
                ?.split('-')
                .pop();
            restore(id!);
        }
    }, [scrollGroup, restore]);

    const remember = useCallback(
        function (id: string) {
            const scrollPositions = window.location.hash
                .slice(1)
                .split('/')
                .filter((it) => !it.startsWith(scrollGroup));

            scrollPositions.push(scrollGroup + '-' + id);

            window.history.replaceState(null, '', '#' + scrollPositions.join('/'));
        },
        [scrollGroup]
    );

    return remember;
}

export function useScrollRestoration({ ref, scrollGroup, scrollId }: { ref: RefObject<HTMLElement | undefined>; scrollGroup: string; scrollId: string }) {
    const remember = useRestoration({
        scrollGroup,
        restore: useCallback(
            (id) => {
                if (id === scrollId) {
                    ref.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center',
                    });
                }
            },
            [ref, scrollId]
        ),
    });

    return useCallback(() => remember(scrollId), [remember, scrollId]);
}

export function useRestoredNumberState(initial: number, scrollGroup: string) {
    const [value, _setValue] = useState(initial);

    const remember = useRestoration({
        scrollGroup,
        restore: (id) => _setValue(parseInt(id, 10)),
    });

    const setValue = useCallback(
        (it: number) => {
            remember('' + it);
            _setValue(it);
        },
        [remember, _setValue]
    );

    return [value, setValue] as const;
}

// On component mount, scroll #root (the element defined in index.html that scrolls) to the top
// This overrides the browser behaviour of restoring the scroll position while navigating between pages.
export function useScrollToTop() {
    useEffect(() => {
        const el = document.getElementById('root')!;
        el.scrollTo(0, 0);
    }, []);
}
