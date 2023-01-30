import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import de from './lang/de';

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false && process.env.NODE_ENV === 'development',
        resources: {
            de: {
                translation: de,
            },
        },
        lng: 'de',
        fallbackLng: 'de',
        interpolation: {
            escapeValue: false,
        },
        react: { useSuspense: false },
        detection: {
            order: ['localStorage', 'navigator', 'cookie', 'sessionStorage', 'localStorage', 'htmlTag', 'querystring', 'subdomain', 'path'],
        },
    });

export default i18next;
