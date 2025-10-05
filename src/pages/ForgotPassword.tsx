import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { cn } from '@/lib/Tailwind';
import { useMutation } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const CHANGE_PASSWORD_MUTATION = gql(`
    mutation changePassword($password: String!) {
        passwordCreate(password: $password)
    }
`);

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { trackEvent } = useMatomo();
    const [form, setForm] = useState<{ newPassword: string; repeatNewPassword: string }>({
        newPassword: '',
        repeatNewPassword: '',
    });
    const [areInputsDirty, setAreInputsDirty] = useState<Record<string, boolean>>({
        newPassword: false,
        repeatNewPassword: false,
    });
    const [passwordError, setPasswordError] = useState('');

    const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION);

    const makeOnChangeHandler = useCallback(
        (key: 'newPassword' | 'repeatNewPassword') => {
            const onChange = (text: string) => {
                setForm({ ...form, [key]: text });
                setAreInputsDirty({ ...areInputsDirty, [key]: true });
            };
            return onChange;
        },
        [form, areInputsDirty]
    );

    const handleTrackToRegistration = () => {
        trackEvent({
            category: 'password-reset',
            action: 'click-event',
            name: 'Registrierung auf Passwort ändern Page',
            documentTitle: 'Passwort ändern – Registrierung Link',
        });
    };

    const handleOnResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await changePassword({ variables: { password: form.newPassword } });
        if (res.data?.passwordCreate) {
            toast.success(t('resetPassword.success'));
            const redirectTo = searchParams?.get('redirectTo');
            navigate(redirectTo || '/');
        } else {
            toast.error(t('resetPassword.error'));
        }
    };

    useEffect(() => {
        if (!areInputsDirty.newPassword || !areInputsDirty.repeatNewPassword) return;
        const noMatch = form.newPassword !== form.repeatNewPassword;
        const invalidLength = form.newPassword.length < 6;
        if (noMatch) {
            setPasswordError(t('registration.hint.password.nomatch'));
            return;
        }
        if (invalidLength) {
            setPasswordError(t('registration.hint.password.length'));
            return;
        }
        setPasswordError('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.newPassword, form.repeatNewPassword, areInputsDirty.newPassword, areInputsDirty.repeatNewPassword]);

    return (
        <div className="bg-primary-lighter flex flex-col h-dvh justify-between flex-1 overflow-y-auto pb-10">
            <div className="flex flex-col flex-1">
                <div className="py-2 pr-4 pl-6 flex justify-end mb-6">
                    <SwitchLanguageButton variant="dropdown" />
                </div>
                <div className="flex flex-1 flex-col items-center justify-center">
                    <Typography className="mb-[26px] whitespace-pre text-center" variant="h2">
                        {t('resetPassword.title')}
                    </Typography>
                    <form
                        onSubmit={handleOnResetPassword}
                        className="flex flex-col justify-center px-6 gap-y-4 w-full sm:max-w-[342px] justify-self-center mb-14"
                    >
                        <div className="flex flex-col w-full gap-y-[6px]">
                            <Label htmlFor="password">{t('resetPassword.newPassword')}</Label>
                            <div className="flex flex-col">
                                <Input
                                    errorMessageClassName={cn({ hidden: true })}
                                    autoFocus
                                    type="password"
                                    variant="white"
                                    id="password"
                                    value={form.newPassword}
                                    onChangeText={makeOnChangeHandler('newPassword')}
                                    placeholder={t('registration.steps.authenticationInfo.passwordPlaceholder')}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-y-[6px]">
                            <Label htmlFor="repeat-password">{t('resetPassword.repeatNewPassword')}</Label>
                            <div className="flex flex-col gap-y-1">
                                <Input
                                    type="password"
                                    variant="white"
                                    id="repeat-password"
                                    value={form.repeatNewPassword}
                                    onChangeText={makeOnChangeHandler('repeatNewPassword')}
                                    helperText={!passwordError ? t('registration.hint.password.length') : undefined}
                                    errorMessage={passwordError}
                                    errorMessageClassName={cn({ hidden: !passwordError })}
                                    placeholder={t('registration.steps.authenticationInfo.passwordPlaceholder')}
                                />
                            </div>
                        </div>
                        <Button
                            size="lg"
                            type="submit"
                            className="w-full"
                            disabled={!!passwordError || !form.newPassword || !form.repeatNewPassword}
                            reasonDisabled={passwordError}
                        >
                            {t('resetPassword.changePassword')}
                        </Button>
                    </form>
                </div>
            </div>
            <div className="flex flex-col gap-y-4 text-center">
                <Typography className="text-form">
                    {`${t('login.noaccount')} `}
                    <Link to="/registration" onClick={handleTrackToRegistration} className="underline decoration-1 underline-offset-[5px]">
                        {t('login.registerHere')}
                    </Link>
                </Typography>
                <div className="flex justify-center">
                    <Typography className="text-form">{t('login.needHelp')}&nbsp;</Typography>
                    <Button
                        className="font-normal text-form inline size-auto p-0"
                        onClick={() =>
                            (window.location.href = 'mailto:support@lern-fair.de?subject=Probleme%20bei%20der%20Anmeldung%20im%20neuen%20Userbereich')
                        }
                        variant="link"
                    >
                        <span className="underline decoration-1">{t('login.contactSupport')}</span>
                    </Button>
                </div>
                <Typography className="text-form">
                    <a className="underline decoration-1 underline-offset-4" href={`${window.origin}/datenschutz`} target="_blank" rel="noreferrer">
                        {t('settings.legal.datapolicy')}
                    </a>
                    &nbsp; & &nbsp;
                    <a className="underline decoration-1 underline-offset-4" href={`${window.origin}/impressum`} target="_blank" rel="noreferrer">
                        {t('settings.legal.imprint')}
                    </a>
                </Typography>
            </div>
        </div>
    );
};

export default ForgotPassword;
