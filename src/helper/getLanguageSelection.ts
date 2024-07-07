import { languageList } from '../I18n';
import { defaultLang } from '../I18n';

// Priority of language selection
// 1) language set in localStorage (set by user-app user)
// 2) language set in browser
// 3) default language

export const getLanguageSelection = () => {
    const storageLang = localStorage.getItem('lernfair-language');
    const navigatorLang = window.navigator.language.split('-')[0];
    const langInList = languageList.findIndex((lang) => lang.short === navigatorLang) > -1;

    const lang = storageLang ? storageLang : langInList ? navigatorLang : defaultLang;

    return lang;
};
