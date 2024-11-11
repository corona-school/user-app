import { createInstance } from '@jonkoops/matomo-tracker-react';
import { DISABLE_MATOMO } from './config';

const matomo = createInstance({
    urlBase: process.env.REACT_APP_MATOMO_URL,
    siteId: 6,
    disabled: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' || DISABLE_MATOMO === 'true',
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

// If a user arrives at some-page?referrer=some-referrer,
// track it using Matomo
const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has('referrer')) {
    matomo.trackEvent({
        category: 'opening',
        action: 'from-referrer',
        name: searchParams.get('referrer')!,
    });
}

export default matomo;
