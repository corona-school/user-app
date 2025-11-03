import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './lang/de.json';
import { Settings } from 'luxon';

// As users will rarely use the non-german version, lazily load these language files
// on demand
const lazyLanguages = {
    ar: () => import('./lang/ar.json'),
    en: () => import('./lang/en.json'),
    ru: () => import('./lang/ru.json'),
    tr: () => import('./lang/tr.json'),
    uk: () => import('./lang/uk.json'),
} as const;

export const languageListSelectionModal = [
    { short: 'de', long: 'deutsch', name: 'Deutsch' },
    { short: 'en', long: 'englisch', name: 'English' },
    { short: 'ar', long: 'arabisch', name: 'اللغة العربية' },
    { short: 'tr', long: 't_rkisch', name: 'Türkçe' },
    { short: 'uk', long: 'ukrainisch', name: 'Українська' },
    { short: 'ru', long: 'russisch', name: 'Русский' },
];

export const languageList = [
    { short: 'sq', long: 'albanisch' },
    { short: 'am', long: 'amharisch' },
    { short: 'ar', long: 'arabisch' },
    { short: 'hy', long: 'armenisch' },
    { short: 'az', long: 'aserbaidschanisch' },
    { short: 'bs', long: 'bosnisch' },
    { short: 'bg', long: 'bulgarisch' },
    { short: 'zh', long: 'chinesisch' },
    { short: 'de', long: 'deutsch' },
    { short: 'en', long: 'englisch' },
    { short: 'et', long: 'estnisch' },
    { short: 'fr', long: 'franz_sisch' },
    { short: 'ka', long: 'georgisch' },
    { short: 'el', long: 'griechisch' },
    { short: 'ha', long: 'hausa' },
    { short: 'he', long: 'hebr_isch' },
    { short: 'hi', long: 'hindi' },
    { short: 'it', long: 'italienisch' },
    { short: 'kk', long: 'kasachisch' },
    { short: 'hr', long: 'kroatisch' },
    { short: 'ku', long: 'kurdisch' },
    { short: 'ln', long: 'lingala' },
    { short: 'lt', long: 'litauisch' },
    { short: 'ml', long: 'malayalam' },
    { short: 'mk', long: 'mazedonisch' },
    { short: 'nl', long: 'niederl_ndisch' },
    { short: 'fa', long: 'persisch' },
    { short: 'pl', long: 'polnisch' },
    { short: 'pt', long: 'portugiesisch' },
    { short: 'ro', long: 'rum_nisch' },
    { short: 'ru', long: 'russisch' },
    { short: 'sr', long: 'serbisch' },
    { short: 'sk', long: 'slowakisch' },
    { short: 'so', long: 'somali' },
    { short: 'es', long: 'spanisch' },
    { short: 'tg', long: 'tadschikisch' },
    { short: 'th', long: 'thail_ndisch' },
    { short: 'ti', long: 'tigrinya' },
    { short: 'cs', long: 'tschechisch' },
    { short: 'tr', long: 't_rkisch' },
    { short: 'uk', long: 'ukrainisch' },
    { short: 'hu', long: 'ungarisch' },
    { short: 'ur', long: 'urdu' },
    { short: 'vi', long: 'vietnamesisch' },
];

export const defaultLang = 'de';

export const resources = {
    de: {
        translation: de,
    },
} as const;

i18next.use(initReactI18next).init({
    debug: false && process.env.NODE_ENV === 'development',
    resources,
    // The app is shipped and opened in german by default, further languages are loaded on demand
    lng: 'de',
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
        Settings.defaultLocale = language;
    }

    i18next.changeLanguage(language);
}

// When opening the App for the first time, set language setting (to localStorage)
// 1) If available, according to localStorage (possible if page is reloaded)
// 2) if coming from lern-fair.de and language subdomain (e.g. en.lern-fair.de) available, according to subdomain
// 3) else, according to defaultLang
const localStorageLanguage = localStorage.getItem('lernfair-language');
if (localStorageLanguage) {
    /* no await, switch lazily */
    switchLanguage(localStorageLanguage);
} else {
    // check for pre-selected language coming from lern-fair.de
    const [subdomain, domain] = document.referrer.split('.');
    let subdomainLanguage;
    if (domain === 'lern-fair') {
        subdomainLanguage = languageListSelectionModal.find((langItem) => subdomain.includes(langItem.short));
    }
    if (subdomainLanguage) {
        switchLanguage(subdomainLanguage.short);
    } else {
        // else set the default language
        switchLanguage(defaultLang);
    }
}

export default i18next;
