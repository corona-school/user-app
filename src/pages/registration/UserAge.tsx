import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';

interface UserAgeProps extends RegistrationStepProps {}

export const UserAge = ({ onBack, onNext }: UserAgeProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const onChange = (value: string) => {
        onFormChange({ age: Number(value.replace(/\D/g, '').substring(0, 2)) });
    };

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={!form.age}>
            <RegistrationStepTitle className="md:mb-10">{t('registration.steps.userAge.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance">
                {t('registration.steps.userAge.description')}
            </Typography>
            <div className="flex flex-col gap-y-3 w-full max-w-20 pb-32 md:pb-0">
                <div className="w-full flex flex-col justify-center gap-y-1">
                    <Input autoFocus variant="white" className="w-full h-12" value={form.age} onChangeText={onChange} />
                </div>
            </div>
        </RegistrationStep>
    );
};
