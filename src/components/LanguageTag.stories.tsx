import { LanguageTag, LanguageTagList } from './LanguageTag';

export default {
    title: 'Molecules/LanguageTag',
    component: LanguageTag,
};

export const BaseLanguageTag = {
    render: () => <LanguageTag language="Deutsch" />,
    name: 'LanguageTag',
};

export const BaseLanguageTagList = {
    render: () => <LanguageTagList languages={['Deutsch', 'Italienisch']} />,
    name: 'LanguageTagList',
};
