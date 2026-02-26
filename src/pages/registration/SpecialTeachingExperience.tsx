import { SpecialTeachingExperienceSelector, SpecialTeachingExperienceEnum } from '@/components/SpecialTeachingExperienceSelector';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OptionalBadge, RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';

interface SpecialTeachingExperienceProps extends RegistrationStepProps {}

export const SpecialTeachingExperience = ({ onBack, onNext }: SpecialTeachingExperienceProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    usePageTitle('Registrierung: SpecialTeachingExperience - optional');

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle>{t('registration.steps.specialTeachingExperience.title')} </RegistrationStepTitle>
            <div className="w-full md:pb-0">
                <SpecialTeachingExperienceSelector
                    multiple
                    value={form.specialTeachingExperience.selectValues}
                    setValue={(specialTeachingExperience) =>
                        onFormChange({ specialTeachingExperience: { ...form.specialTeachingExperience, selectValues: specialTeachingExperience } })
                    }
                    className="flex flex-wrap justify-center"
                    toggleConfig={{
                        variant: 'white-primary',
                        size: 'lg',
                    }}
                    freeTextConfig={{
                        placeholder: t('formalEducation.other'),
                        freeTextOption: SpecialTeachingExperienceEnum.other,
                        value: form.specialTeachingExperience?.freeTextValue,
                        onChange: (value) => onFormChange({ specialTeachingExperience: { ...form.specialTeachingExperience, freeTextValue: value } }),
                    }}
                />
            </div>
        </RegistrationStep>
    );
};
