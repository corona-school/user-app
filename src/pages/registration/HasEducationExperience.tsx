import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OptionalBadge, RegistrationStep, RegistrationStepDescription, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { Toggle } from '@/components/Toggle';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { useRegistrationForm } from './useRegistrationForm';

interface HasEducationExperienceProps extends RegistrationStepProps {}

export const HasEducationExperience = ({ onBack, onNext }: HasEducationExperienceProps) => {
    usePageTitle('Registrierung: Arbeit mit Kindern oder Jugendlichen - optional');
    const { form, onFormChange } = useRegistrationForm();

    const { t } = useTranslation();

    return (
        <RegistrationStep onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle>{t('registration.steps.hasEducationExperience.title')}</RegistrationStepTitle>
            <RegistrationStepDescription className="mb-10">{t('registration.steps.hasEducationExperience.description')}</RegistrationStepDescription>
            <div className="flex flex-col md:flex-row gap-y-4 gap-x-4">
                <Toggle
                    size="2xl"
                    variant="white-primary"
                    pressed={form.hasWorkingExperienceInEducation}
                    onPressedChange={() => onFormChange({ hasWorkingExperienceInEducation: !form.hasWorkingExperienceInEducation })}
                >
                    <IconThumbUp size={32} />
                    {t('yes')}
                </Toggle>
                <Toggle
                    size="2xl"
                    variant="white-primary"
                    pressed={form.hasWorkingExperienceInEducation === false}
                    onPressedChange={() => onFormChange({ hasWorkingExperienceInEducation: !form.hasWorkingExperienceInEducation })}
                >
                    <IconThumbDown size={32} />
                    {t('no')}
                </Toggle>
            </div>
        </RegistrationStep>
    );
};
