import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { useCallback } from 'react';

interface UserNameProps extends RegistrationStepProps {}

export const UserName = ({ onBack, onNext }: UserNameProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const makeOnChangeHandler = useCallback(
        (key: 'firstname' | 'lastname') => {
            const onChange = (text: string) => {
                onFormChange({ [key]: text });
            };
            return onChange;
        },
        [onFormChange]
    );

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={!form.firstname || !form.lastname}>
            <Typography variant="body-lg" className="text-center mb-10 whitespace-pre-line text-balance">
                {t('registration.steps.userName.congratsHint')}
            </Typography>
            <RegistrationStepTitle className="mb-10">{t('registration.steps.userName.title')}</RegistrationStepTitle>
            <div className="flex flex-col gap-y-3 w-full max-w-[268px] pb-32 md:pb-0">
                <div className="w-full flex flex-col justify-center gap-y-1">
                    <Label htmlFor="firstName" className="text-subtle w-full text-center">
                        {t('firstname')}
                    </Label>
                    <Input
                        autoFocus
                        variant="white"
                        className="w-full h-12"
                        id="firstName"
                        value={form.firstname}
                        onChangeText={makeOnChangeHandler('firstname')}
                        errorMessageClassName="hidden"
                    />
                </div>
                <div className="w-full flex flex-col justify-center gap-y-1">
                    <Label htmlFor="lastName" className="text-subtle w-full text-center">
                        {t('lastname')}
                    </Label>
                    <Input
                        variant="white"
                        className="w-full h-12"
                        id="lastName"
                        value={form.lastname}
                        onChangeText={makeOnChangeHandler('lastname')}
                        errorMessageClassName="hidden"
                    />
                </div>
            </div>
        </RegistrationStep>
    );
};
