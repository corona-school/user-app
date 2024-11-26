import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AL, AM, AZ, BA, BG, CN, DE, ES, FR, GB, IR, KZ, PL, PT, SA, TR, UA, VN, RU, IT } from 'country-flag-icons/react/1x1';
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
    { short: 'al', long: 'albanisch', name: '' },
    { short: 'am', long: 'armenisch', name: '' },
    { short: 'ar', long: 'arabisch', name: 'اللغة العربية' },
    { short: 'az', long: 'aserbaidschanisch', name: '' },
    { short: 'ba', long: 'bosnisch', name: '' },
    { short: 'bg', long: 'bulgarisch', name: '' },
    { short: 'cn', long: 'chinesisch', name: '' },
    { short: 'de', long: 'deutsch', name: 'Deutsch' },
    { short: 'en', long: 'englisch', name: 'English' },
    { short: 'es', long: 'spanisch', name: 'Espana' },
    { short: 'fr', long: 'franz_sisch', name: 'France' },
    { short: 'it', long: 'italienisch', name: 'Italian' },
    { short: 'ir', long: 'kurdisch', name: '' },
    { short: 'kz', long: 'kasachisch', name: '' },
    { short: 'pl', long: 'polnisch', name: '' },
    { short: 'pt', long: 'portugiesisch', name: '' },
    { short: 'ru', long: 'russisch', name: 'Русский' },
    { short: 'tr', long: 't_rkisch', name: 'Türkçe' },
    { short: 'uk', long: 'ukrainisch', name: 'Українська' },
    { short: 'vn', long: 'vietnamesisch', name: '' },
];

export const languageIcons = {
    al: AL,
    am: AM,
    ar: SA,
    az: AZ,
    ba: BA,
    bg: BG,
    cn: CN,
    de: DE,
    en: GB,
    es: ES,
    fr: FR,
    it: IT,
    ir: IR,
    kz: KZ,
    pl: PL,
    pt: PT,
    ru: RU,
    tr: TR,
    uk: UA,
    vn: VN,
};

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
