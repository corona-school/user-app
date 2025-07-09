import { Language } from '@/gql/graphql';
import { languageIcons, languageList } from '@/I18n';
import { IconQuestionMark } from '@tabler/icons-react';
import { EnumSelector } from './EnumSelector';

export const LanguageSelector = EnumSelector(
    Language,
    (k) => `lernfair.languages.${k.toLowerCase()}` as any,
    (k) => {
        const language = languageList.find((e) => e.long === k.toLowerCase());
        if (!language) return <IconQuestionMark className="size-6" />;
        const short = language.short as keyof typeof languageIcons;
        const Icon = languageIcons[short];
        return <Icon className="rounded-full size-6" />;
    }
);
