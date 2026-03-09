import { TeachingExperienceLevelSelector } from '@/components/TeachingExperienceLevelSelector';
import { Typography } from '@/components/Typography';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OptionalBadge, RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';

interface TeachingExperienceLevelProps extends RegistrationStepProps {}

export const TeachingExperienceLevel = ({ onBack, onNext }: TeachingExperienceLevelProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    usePageTitle('Registrierung: Deine Unterrichtserfahrung - optional');

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle>{t('registration.steps.teachingExperience.title')}</RegistrationStepTitle>
            <div className="w-full md:pb-0">
                <div className="mb-8">
                    <Typography className="font-medium text-center mb-4">{t('registration.steps.teachingExperience.individual')}</Typography>
                    <div className="flex justify-center gap-x-2">
                        <TeachingExperienceLevelSelector
                            toggleConfig={{
                                variant: 'white-primary',
                                size: 'lg',
                            }}
                            value={form.teachingExperience?.['1:1']}
                            setValue={(value) => onFormChange({ teachingExperience: { ...form.teachingExperience, '1:1': value } })}
                        />
                    </div>
                </div>
                <div>
                    <Typography className="font-medium text-center mb-4">{t('registration.steps.teachingExperience.group')}</Typography>
                    <div className="flex justify-center gap-x-2">
                        <TeachingExperienceLevelSelector
                            toggleConfig={{
                                variant: 'white-primary',
                                size: 'lg',
                            }}
                            value={form.teachingExperience?.group}
                            setValue={(value) => onFormChange({ teachingExperience: { ...form.teachingExperience, group: value } })}
                        />
                    </div>
                </div>
            </div>
        </RegistrationStep>
    );
};
