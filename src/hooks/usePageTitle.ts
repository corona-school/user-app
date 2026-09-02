import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useEffect } from 'react';

interface UsePageTitleOptions {
    skip: boolean;
}

export const usePageTitle = (title: string, { skip }: UsePageTitleOptions = { skip: false }) => {
    const { trackPageView } = useMatomo();
    useEffect(() => {
        if (!skip) {
            console.log({ TRACKING_TEST: title });
            document.title = title;
            trackPageView({ documentTitle: title });
        }

        return () => {
            document.title = 'Lern-Fair';
        };
    }, [title, skip]);
};
