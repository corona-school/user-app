import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguageSelection } from './helper/getLanguageSelection';

import de from './lang/de.json';
import en from './lang/en.json';
import ar from './lang/ar.json';
import uk from './lang/uk.json';
import tr from './lang/tr.json';
import ru from './lang/ru.json';
import IconDE from './assets/icons/icon_flag_de.svg';
import IconEN from './assets/icons/icon_flag_en.svg';
import IconUK from './assets/icons/icon_flag_uk.svg';
import IconTR from './assets/icons/icon_flag_tr.svg';
import IconRU from './assets/icons/icon_flag_ru.svg';
import IconAR from './assets/icons/icon_flag_ar.svg';
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

export const languageList = [
    { short: 'de', name: 'Deutsch' },
    { short: 'en', name: 'English' },
    { short: 'ar', name: 'اللغة العربية' },
    { short: 'tr', name: 'Türkçe' },
    { short: 'uk', name: 'Українська' },
    { short: 'ru', name: 'Русский' },
];

export const languageComponents = {
    de: IconDE,
    en: IconEN,
    ar: IconAR,
    tr: IconTR,
    uk: IconUK,
    ru: IconRU,
};

export const defaultLang = 'en';

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
    uk: {
        translation: uk,
    },
    ar: {
        translation: ar,
    },
} as const;

i18next.use(initReactI18next).init({
    debug: false && process.env.NODE_ENV === 'development',
    resources,
    lng: getLanguageSelection(),
    fallbackLng: defaultLang,
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

// check for pre-selected language coming from lern-fair.de
const referrer = document.referrer
    .split(/[:/.]/)
    .filter((elm) => elm)
    .slice(0, -1);
languageList.map((abbr) => referrer.includes(abbr.short) && switchLanguage(abbr.short));

export default i18next;
