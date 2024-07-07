import { languageList } from '../I18n';
import { defaultLang } from '../I18n';

export const getLanguageSelection = () => {
    const storageLang = localStorage.getItem('lernfair-language');
    const navigatorLang = window.navigator.language.split('-')[0];
    const langInList = languageList.findIndex((lang) => lang.short === navigatorLang) > -1;

    const lang = storageLang ? storageLang : langInList ? navigatorLang : defaultLang;

    return lang;
};
