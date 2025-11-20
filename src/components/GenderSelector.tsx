import { Gender } from '@/gql/graphql';
import { cn } from '@/lib/Tailwind';
import { EnumSelector } from './EnumSelector';
import { IconGenderBigender, IconGenderFemale, IconGenderMale } from '@tabler/icons-react';

export const GenderSelector = EnumSelector(
    Gender,
    (k) => `lernfair.genders.${k.toLowerCase()}` as any,
    (k) => <GenderIcon genderName={k} />
);

export const GenderIcon = ({ genderName, className }: { genderName: Gender; className?: string }) => {
    switch (genderName) {
        case Gender.Male:
            return <IconGenderMale className={cn('rounded-full size-6 flex-shrink-0', className)} />;
        case Gender.Female:
            return <IconGenderFemale className={cn('rounded-full size-6 flex-shrink-0', className)} />;
        case Gender.Diverse:
            return <IconGenderBigender className={cn('rounded-full size-6 flex-shrink-0', className)} />;
        default:
            return null;
    }
};
