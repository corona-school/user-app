import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AL, AM, AZ, BA, BG, CN, DE, ES, FR, GB, GR, HR, IR, KR, KZ, PL, PT, RO, RS, SA, TR, UA, VN, RU, IT } from 'country-flag-icons/react/1x1';
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
    { short: 'al', long: 'albanisch' },
    { short: 'am', long: 'armenisch' },
    { short: 'ar', long: 'arabisch' },
    { short: 'az', long: 'aserbaidschanisch' },
    { short: 'ba', long: 'bosnisch' },
    { short: 'bg', long: 'bulgarisch' },
    { short: 'cn', long: 'chinesisch' },
    { short: 'de', long: 'deutsch' },
    { short: 'en', long: 'englisch' },
    { short: 'es', long: 'spanisch' },
    { short: 'fr', long: 'franz_sisch' },
    { short: 'gr', long: 'griechisch' },
    { short: 'hr', long: 'kroatisch' },
    { short: 'it', long: 'italienisch' },
    { short: 'ir', long: 'kurdisch' },
    { short: 'irn', long: 'farsi' },
    { short: 'kz', long: 'kasachisch' },
    { short: 'kr', long: 'koreanisch' },
    { short: 'pl', long: 'polnisch' },
    { short: 'pt', long: 'portugiesisch' },
    { short: 'ro', long: 'rum_nisch' },
    { short: 'rs', long: 'serbisch' },
    { short: 'ru', long: 'russisch' },
    { short: 'tr', long: 't_rkisch' },
    { short: 'uk', long: 'ukrainisch' },
    { short: 'vn', long: 'vietnamesisch' },
    { short: 'oth', long: 'andere' },
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
    gr: GR,
    hr: HR,
    it: IT,
    ir: IR,
    irn: IR,
    kr: KR,
    kz: KZ,
    pl: PL,
    pt: PT,
    ro: RO,
    rs: RS,
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
