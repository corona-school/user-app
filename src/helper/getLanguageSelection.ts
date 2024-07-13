import { languageList } from '../I18n';
import { defaultLang } from '../I18n';

// Priority of language selection
// 1) language set in localStorage (set by user-app user)
// 2) default language

export const getLanguageSelection = () => {
    const storageLang = localStorage.getItem('lernfair-language');
    const lang = storageLang ? storageLang : defaultLang;

    return lang;
};
