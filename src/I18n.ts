import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './lang/de.json';
import en from './lang/en.json';
import ru from './lang/ru.json';
import tr from './lang/tr.json';

import { LANGUAGE_SWITCHER_ACTIVE } from './config';

// As users will rarely use the non-german version, lazily load these language files
// on demand
const lazyLanguages = {
    ar: () => import('./lang/ar.json'),
    en: () => import('./lang/en.json'),
    ru: () => import('./lang/ru.json'),
    tr: () => import('./lang/tr.json'),
    uk: () => import('./lang/uk.json'),
} as const;

export const resources = {
    de: {
        translation: de,
    },
    en: {
        translation: en,
    },
    ru: {
        translation: ru,
    },
    tr: {
        translation: tr,
    },
} as const;

i18next.use(initReactI18next).init({
    debug: false && process.env.NODE_ENV === 'development',
    resources,
    // The app is shipped and opened in german by default, further languages are loaded on demand
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
        escapeValue: false,
    },
    react: { useSuspense: false },
    returnNull: false,
});

export async function switchLanguage(language: string) {
    localStorage.setItem('lernfair-language', language);

    if (language in lazyLanguages) {
        i18next.addResourceBundle(language, 'translation', await lazyLanguages[language as keyof typeof lazyLanguages](), true, true);
    }

    i18next.changeLanguage(language);
}

if (LANGUAGE_SWITCHER_ACTIVE) {
    // When opening the App for the first time, switch to another language if needed
    const switchedLanguage = localStorage.getItem('lernfair-language');
    if (switchedLanguage) {
        /* no await, switch lazily */ switchLanguage(switchedLanguage);
    }
}

export default i18next;
