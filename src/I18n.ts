import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import de from './lang/de.json';
import en from './lang/en.json';

export const resources = {
    de: {
        translation: de,
    },
    en: {
        translation: en,
    },
} as const;

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false && process.env.NODE_ENV === 'development',
        resources: resources,
        lng: 'en',
        fallbackLng: 'de',
        interpolation: {
            escapeValue: false,
        },
        react: { useSuspense: false },
        detection: {
            order: ['localStorage', 'navigator', 'cookie', 'sessionStorage', 'localStorage', 'htmlTag', 'querystring', 'subdomain', 'path'],
        },
        returnNull: false,
    });

export default i18next;
