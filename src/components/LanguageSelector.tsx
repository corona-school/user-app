import { Language } from '@/gql/graphql';
import { languageIcons, languageList } from '@/I18n';
import { cn } from '@/lib/Tailwind';
import { IconQuestionMark } from '@tabler/icons-react';
import { EnumSelector } from './EnumSelector';

export const LanguageSelector = EnumSelector(
    Language,
    (k) => `lernfair.languages.${k.toLowerCase()}` as any,
    (k) => <LanguageIcon languageName={k} />
);

export const LanguageIcon = ({ languageName, className }: { languageName: string; className?: string }) => {
    const item = languageList.find((e) => e.long === languageName.toLowerCase());
    if (!item) return <IconQuestionMark className="size-6" />;
    const short = item.short as keyof typeof languageIcons;
    const Icon = languageIcons[short];
    return <Icon className={cn('rounded-full size-6', className)} />;
};
