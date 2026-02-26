import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OptionalBadge, RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { FormalEducationEnum, FormalEducationSelector } from '@/components/FormalEducationSelector';

interface FormalEducationProps extends RegistrationStepProps {}

export const FormalEducation = ({ onBack, onNext }: FormalEducationProps) => {
    usePageTitle('Registrierung: Deine formelle Ausbildung - optional');
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={form.hasWorkingExperienceInEducation === undefined}>
            <OptionalBadge />
            <RegistrationStepTitle>{t('registration.steps.formalEducation.title')}</RegistrationStepTitle>
            <div className="flex flex-col items-center gap-y-3 w-full pb-32 md:pb-0">
                <div className="w-full md:pb-0">
                    <FormalEducationSelector
                        value={
                            form.formalEducation?.startsWith(FormalEducationEnum.other)
                                ? FormalEducationEnum.other
                                : (form.formalEducation as FormalEducationEnum)
                        }
                        setValue={(value) => onFormChange({ formalEducation: value })}
                        className="flex flex-wrap justify-center"
                        toggleConfig={{
                            variant: 'white-primary',
                            size: 'lg',
                        }}
                        freeTextConfig={{
                            placeholder: t('formalEducation.other'),
                            freeTextOption: FormalEducationEnum.other,
                            value: form.formalEducation?.startsWith(`${FormalEducationEnum.other}:`) ? form.formalEducation : '',
                            onChange: (value) => onFormChange({ formalEducation: value }),
                        }}
                    />
                </div>
            </div>
        </RegistrationStep>
    );
};
