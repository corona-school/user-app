import { useTranslation } from 'react-i18next';
import { OptionalBadge, RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { RegistrationForm, useRegistrationForm } from './useRegistrationForm';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';

interface ZipCodeProps extends RegistrationStepProps {}

export const ZipCode = ({ onBack, onNext }: ZipCodeProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const onChange = (value: string) => {
        const zipCode = value.replace(/\D/g, '');
        const change: Partial<RegistrationForm> = { zipCode };
        if (form.userType === 'pupil') {
            change.school = { ...form.school, zip: zipCode };
        }
        onFormChange(change);
    };

    return (
        <RegistrationStep onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle>{t('registration.steps.zipCode.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance">
                {t(form.userType === 'pupil' ? 'registration.steps.zipCode.descriptionPupil' : 'registration.steps.zipCode.descriptionStudent')}
            </Typography>
            <div className="flex flex-col gap-y-3 w-full max-w-20 pb-32 md:pb-0">
                <div className="w-full flex flex-col justify-center gap-y-1">
                    <Input autoFocus={!form.zipCode} variant="white" className="w-full h-12" value={form.zipCode || ''} onChangeText={onChange} />
                </div>
            </div>
        </RegistrationStep>
    );
};
