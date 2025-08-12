import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';

interface ZipCodeProps extends RegistrationStepProps {}

export const ZipCode = ({ onBack, onNext }: ZipCodeProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const onChange = (value: string) => {
        onFormChange({ zipCode: Number(value.replace(/\D/g, '')) });
    };

    return (
        <RegistrationStep onBack={onBack} onNext={onNext}>
            <RegistrationStepTitle className="md:mb-10">{t('registration.steps.zipCode.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance"></Typography>
            <div className="flex flex-col gap-y-3 w-full max-w-20 pb-32 md:pb-0">
                <div className="w-full flex flex-col justify-center gap-y-1">
                    <Input autoFocus variant="white" className="w-full h-12" value={form.zipCode || ''} onChangeText={onChange} />
                </div>
            </div>
        </RegistrationStep>
    );
};
