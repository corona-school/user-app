import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
    const { trackPageView } = useMatomo();
    useEffect(() => {
        document.title = title;
        trackPageView({ documentTitle: title });
        return () => {
            document.title = 'Lern-Fair';
        };
    }, [title]);
};
