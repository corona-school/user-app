import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';
import { useState } from 'react';
import { Toggle } from '@/components/Toggle';

interface UserAgeProps extends RegistrationStepProps {}

const MIN_AGE_PUPIL = 7;

export const UserAge = ({ onBack, onNext }: UserAgeProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    const [error, setError] = useState(!!form.age && form.age < MIN_AGE_PUPIL ? t('registration.steps.userAge.tooYoungError', { minAge: MIN_AGE_PUPIL }) : '');

    const onPupilAgeChange = (value: string) => {
        const age = Number(value.replace(/\D/g, '').substring(0, 2));
        if (age >= MIN_AGE_PUPIL) {
            setError('');
        } else {
            setError(t('registration.steps.userAge.tooYoungError', { minAge: MIN_AGE_PUPIL }));
        }
        onFormChange({ age });
    };

    const isNextDisabled = (form.userType === 'pupil' && (!form.age || !!error)) || (form.userType === 'student' && form.isAdult === undefined);

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={isNextDisabled}>
            <RegistrationStepTitle>{t('registration.steps.userAge.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance">
                {t(form.userType === 'pupil' ? 'registration.steps.userAge.descriptionPupil' : 'registration.steps.userAge.descriptionStudent')}
            </Typography>
            {form.userType === 'pupil' && (
                <div className="flex flex-col items-center gap-y-3 w-full pb-32 md:pb-0">
                    <div className="w-full flex flex-col items-center justify-center gap-y-1 max-w-[300px] text-center">
                        <Input
                            autoFocus={!form.age}
                            variant="white"
                            className="w-full h-12 max-w-20"
                            value={form.age || ''}
                            onChangeText={onPupilAgeChange}
                            errorMessage={error}
                            errorMessageClassName="min-h-10"
                            min={MIN_AGE_PUPIL}
                        />
                    </div>
                </div>
            )}
            {form.userType === 'student' && (
                <div className="flex flex-col md:flex-row gap-y-4 gap-x-4">
                    <Toggle size="2xl" variant="white-primary" pressed={form.isAdult === false} onPressedChange={() => onFormChange({ isAdult: false })}>
                        {t('registration.steps.userAge.underAgeRange')}
                    </Toggle>
                    <Toggle size="2xl" variant="white-primary" pressed={form.isAdult} onPressedChange={() => onFormChange({ isAdult: true })}>
                        {t('registration.steps.userAge.adultAge')}
                    </Toggle>
                </div>
            )}
        </RegistrationStep>
    );
};
