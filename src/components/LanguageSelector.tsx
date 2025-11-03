import { Language } from '@/gql/graphql';
import { cn } from '@/lib/Tailwind';
import { EnumSelector } from './EnumSelector';
import { IconLoader } from './IconLoader';

const priorityLanguages: Language[] = [
    Language.Deutsch,
    Language.TRkisch,
    Language.Arabisch,
    Language.Ukrainisch,
    Language.Russisch,
    Language.Polnisch,
    Language.RumNisch,
    Language.Englisch,
];

const getSortedLanguages = () => {
    const entries = Object.entries(Language);

    const priorityEntries = priorityLanguages.map((val) => entries.find(([_, v]) => v === val)!);

    const remainingEntries = entries
        .filter(([_, v]) => !priorityLanguages.includes(v))
        .sort((a, b) => {
            if (a[1] === Language.Andere) return 1;
            if (b[1] === Language.Andere) return -1;
            return a[1].localeCompare(b[1]);
        });
    const sortedEntries = [...priorityEntries, ...remainingEntries];

    return Object.fromEntries(sortedEntries);
};

export const LanguageSelector = EnumSelector(
    getSortedLanguages(),
    (k) => `lernfair.languages.${k.toLowerCase()}` as any,
    (k) => <LanguageIcon languageName={k} />
);

export const LanguageIcon = ({ languageName, className }: { languageName: string; className?: string }) => {
    return <IconLoader icon={languageName.toLowerCase()} className={cn('rounded-full size-6 flex-shrink-0', className)} />;
};
