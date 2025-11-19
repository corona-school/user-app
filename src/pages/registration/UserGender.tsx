import { useTranslation } from 'react-i18next';
import { OptionalBadge, RegistrationStep, RegistrationStepDescription, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Toggle } from '@/components/Toggle';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Gender } from '@/gql/graphql';
import { IconGenderBigender, IconGenderFemale, IconGenderMale, IconX } from '@tabler/icons-react';

interface UserGenderProps extends RegistrationStepProps {}

export const UserGender = ({ onBack, onNext }: UserGenderProps) => {
    const { form, onFormChange } = useRegistrationForm();
    usePageTitle(`Registrierung: Geschlecht Helfer:in`);
    const { t } = useTranslation();

    return (
        <RegistrationStep onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle>{t('registration.steps.userGender.title')}</RegistrationStepTitle>
            <RegistrationStepDescription className="mb-10">{t('registration.steps.userGender.description')}</RegistrationStepDescription>
            <div className="flex flex-col md:flex-row flex-wrap justify-center place-items-center gap-y-2 md:gap-y-4 gap-x-4 w-full">
                <Toggle
                    size="2xl"
                    className="md:w-[260px] h-[80px] md:h-[100px]"
                    variant="white-primary"
                    pressed={form.gender === Gender.Female}
                    onPressedChange={() => onFormChange({ gender: Gender.Female })}
                >
                    <IconGenderFemale size={32} />
                    {t('registration.steps.userGender.female')}
                </Toggle>
                <Toggle
                    size="2xl"
                    className="md:w-[260px] h-[80px] md:h-[100px]"
                    variant="white-primary"
                    pressed={form.gender === Gender.Male}
                    onPressedChange={() => onFormChange({ gender: Gender.Male })}
                >
                    <IconGenderMale size={32} />
                    {t('registration.steps.userGender.male')}
                </Toggle>
                <Toggle
                    size="2xl"
                    className="md:w-[260px] h-[80px] md:h-[100px]"
                    variant="white-primary"
                    pressed={form.gender === Gender.Diverse}
                    onPressedChange={() => onFormChange({ gender: Gender.Diverse })}
                >
                    <IconGenderBigender size={32} />
                    {t('registration.steps.userGender.diverse')}
                </Toggle>
                <Toggle
                    size="2xl"
                    className="md:w-[260px] h-[80px] md:h-[100px]"
                    variant="white-primary"
                    pressed={form.gender === Gender.Other}
                    onPressedChange={() => onFormChange({ gender: Gender.Other })}
                >
                    <IconX size={32} />
                    {t('registration.steps.userGender.other')}
                </Toggle>
            </div>
        </RegistrationStep>
    );
};
