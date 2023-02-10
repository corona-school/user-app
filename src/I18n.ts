import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './lang/de';

export const resources = {
    de: {
        translation: de,
    },
} as const;

i18next.use(initReactI18next).init({
    debug: false && process.env.NODE_ENV === 'development',
    resources: resources,
    fallbackLng: 'de',
    detection: {
        order: ['localStorage', 'navigator', 'cookie', 'sessionStorage', 'localStorage', 'htmlTag', 'querystring', 'subdomain', 'path'],
    },
    returnNull: false,
});
