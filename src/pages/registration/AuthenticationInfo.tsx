import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { useCallback, useEffect, useState } from 'react';
import { GOOGLE_CLIENT_ID } from '@/config';
import { Button } from '@/components/Button';
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import useLoginWithIDP from '@/hooks/useLoginWithIDP';
import isEmail from 'validator/lib/isEmail';
import { cn } from '@/lib/Tailwind';

interface AuthenticationInfoProps extends RegistrationStepProps {}

export const AuthenticationInfo = ({ onBack, onNext }: AuthenticationInfoProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    const { loginWithGoogle } = useLoginWithIDP();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [areInputsDirty, setAreInputsDirty] = useState<Record<string, boolean>>({
        email: false,
        password: false,
    });

    useEffect(() => {
        if (!areInputsDirty.email) return;
        if (!form.email) {
            setEmailError(t('reasonsDisabled.fieldEmpty'));
        } else if (!isEmail(form.email)) {
            setEmailError(t('reasonsDisabled.invalidEMail'));
        }
    }, [form.email, areInputsDirty.email, t]);

    useEffect(() => {
        if (!areInputsDirty.password) return;
        if (!form.password) {
            setPasswordError(t('reasonsDisabled.fieldEmpty'));
        }
    }, [form.password, areInputsDirty.password, t]);

    const makeOnChangeHandler = useCallback(
        (key: 'email' | 'password') => {
            const onChange = (text: string) => {
                onFormChange({ [key]: text });
            };
            return onChange;
        },
        [onFormChange]
    );

    const makeOnBlurHandler = useCallback(
        (key: 'email' | 'password') => {
            const onBlur = () => {
                setAreInputsDirty({ [key]: true });
            };
            return onBlur;
        },
        [setAreInputsDirty]
    );

    const isNextDisabled = () => {
        return !!emailError || !form.email || !!passwordError || !form.password;
    };

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={isNextDisabled()}>
            <RegistrationStepTitle className="md:mb-4">{t('registration.steps.authenticationInfo.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 whitespace-pre-line text-balance">
                {t('registration.steps.authenticationInfo.description')}
            </Typography>
            <div className="flex flex-col gap-y-8 w-full max-w-[339px] md:pb-0">
                {GOOGLE_CLIENT_ID && (
                    <>
                        <Button type="button" className="w-full" variant="optional" rightIcon={<IconBrandGoogleFilled size={16} />} onClick={loginWithGoogle}>
                            {t('registration.steps.authenticationInfo.registerWith', { method: 'Google' })}
                        </Button>
                        <Typography className="font-medium capitalize text-center">{t('or')}</Typography>
                    </>
                )}
                <div className="flex flex-col gap-y-4">
                    <div className="w-full flex flex-col justify-center gap-y-1">
                        <Label htmlFor="email" className="text-subtle w-full">
                            {t('registration.steps.authenticationInfo.pupilEmail')}
                        </Label>
                        <Input
                            onBlur={makeOnBlurHandler('email')}
                            variant="white"
                            id="email"
                            value={form.email}
                            onChangeText={makeOnChangeHandler('email')}
                            errorMessage={emailError}
                            placeholder={t('registration.steps.authenticationInfo.emailPlaceholder')}
                        />
                    </div>
                    <div className="w-full flex flex-col justify-center gap-y-1">
                        <Label htmlFor="password">{t('password')}</Label>
                        <Input
                            onBlur={makeOnBlurHandler('password')}
                            type="password"
                            variant="white"
                            id="password"
                            value={form.password}
                            onChangeText={makeOnChangeHandler('password')}
                            placeholder={t('registration.steps.authenticationInfo.passwordPlaceholder')}
                        />
                        <Typography className={cn('mt-[2px]', { 'text-destructive': areInputsDirty.password && form.password.length < 6 })} variant="sm">
                            {t('registration.hint.password.length')}
                        </Typography>
                    </div>
                </div>
            </div>
        </RegistrationStep>
    );
};
