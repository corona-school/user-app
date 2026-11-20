import { createContext, useContext } from 'react';

/**
 * Lets a rendered `Breadcrumb` tell the surrounding `WithNavigation` that the page has a breadcrumb,
 * and which route its parent item points to. The header uses it to show a back button on mobile.
 */
export interface BreadcrumbBackContextValue {
    /**
     * Route of the breadcrumb's parent item ('' if it has none).
     * It is kept until the page (its WithNavigation) unmounts, so the header doesn't flicker
     * when the breadcrumb is temporarily not rendered (e.g. while the page is loading again).
     */
    setBreadcrumbBackRoute: (route: string) => void;
}

export const BreadcrumbBackContext = createContext<BreadcrumbBackContextValue | null>(null);

export const useBreadcrumbBackContext = () => useContext(BreadcrumbBackContext);
