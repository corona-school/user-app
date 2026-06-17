import { createInstance, MatomoProvider as MP } from '@jonkoops/matomo-tracker-react';
import { DISABLE_MATOMO } from './config';

const isMatomoEnabled = process.env.NODE_ENV === 'production' && !DISABLE_MATOMO && !!process.env.REACT_APP_MATOMO_URL;

let matomo: any; // wir benutzen 'any' hier für Dev Dummy, TypeScript meckert nicht

if (isMatomoEnabled) {
    matomo = createInstance({
        urlBase: process.env.REACT_APP_MATOMO_URL!,
        siteId: 6,
        disabled: false,
        configurations: {
            setCookieDomain: ['*.lern-fair.de'],
            setDomains: ['*.lern-fair.de', '*.app.lern-fair.de'],
            enableCrossDomainLinking: true,
            setExcludedQueryParams: ['token', 'secret_token', 'legacyToken', 'redirectTo'],
            disableCookies: true,
            trackPageView: true,
            enableLinkTracking: true,
        },
    });

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('referrer')) {
        matomo.trackEvent({
            category: 'opening',
            action: 'from-referrer',
            name: searchParams.get('referrer') || undefined,
        });
    }
} else {
    // Dummy für Dev/Test
    matomo = {
        trackPageView: () => {},
        trackEvent: () => {},
        trackEvents: () => {},
        trackSiteSearch: () => {},
        trackLink: () => {},
        pushInstruction: () => {},
        enableLinkTracking: () => {},
        disableCookies: () => {},
        setCookieDomain: () => {},
        setDomains: () => {},
        enableCrossDomainLinking: () => {},
        setExcludedQueryParams: () => {},
        configurations: {},
    };
}

export default matomo;
