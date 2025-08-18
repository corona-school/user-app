import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';
import { useState } from 'react';

interface UserAgeProps extends RegistrationStepProps {}

const MIN_AGE = 7;

export const UserAge = ({ onBack, onNext }: UserAgeProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    const [error, setError] = useState(!!form.age && form.age < MIN_AGE ? t('registration.steps.userAge.tooYoungError', { minAge: MIN_AGE }) : '');

    const onChange = (value: string) => {
        const age = Number(value.replace(/\D/g, '').substring(0, 2));
        if (age >= MIN_AGE) {
            setError('');
        } else {
            setError(t('registration.steps.userAge.tooYoungError', { minAge: MIN_AGE }));
        }
        onFormChange({ age });
    };

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={!form.age || !!error}>
            <RegistrationStepTitle className="md:mb-10">{t('registration.steps.userAge.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance">
                {t('registration.steps.userAge.description')}
            </Typography>
            <div className="flex flex-col items-center gap-y-3 w-full pb-32 md:pb-0">
                <div className="w-full flex flex-col items-center justify-center gap-y-1 max-w-[300px] text-center">
                    <Input
                        autoFocus
                        variant="white"
                        className="w-full h-12 max-w-20"
                        value={form.age || ''}
                        onChangeText={onChange}
                        errorMessage={error}
                        errorMessageClassName="min-h-10"
                        min={MIN_AGE}
                    />
                </div>
            </div>
        </RegistrationStep>
    );
};
