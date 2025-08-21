import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WelcomeLoki from '@/assets/icons/welcome-loki.svg';
import { Button } from '@/components/Button';
import { IconBrandGoogleFilled, IconMail } from '@tabler/icons-react';
import { Typography } from '@/components/Typography';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import isEmail from 'validator/lib/isEmail';
import { toast } from 'sonner';
import InformationModal from '@/modals/InformationModal';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import useApollo, { getOrCreateDeviceId } from '@/hooks/useApollo';
import { Alert } from '@/components/Alert';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { REDIRECT_PASSWORD } from '@/Utility';
import { GOOGLE_CLIENT_ID } from '@/config';
import useLoginWithIDP from '@/hooks/useLoginWithIDP';
import { cn } from '@/lib/Tailwind';

const DETERMINE_LOGIN_OPTIONS_MUTATION = gql(`
    mutation determineLoginOptions($email: String!) {
        userDetermineLoginOptions(email: $email)
    }
`);

const RESET_PASSWORD_MUTATION = gql(`
    mutation PasswordReset($email: String!, $redirectTo: String!) {
        tokenRequest(email: $email, action: "user-password-reset", redirectTo: $redirectTo)
    }
`);

const REQUEST_TOKEN_MUTATION = gql(`
    mutation Authenticate($email: String!, $redirectTo: String!) {
        tokenRequest(email: $email, action: "user-authenticate", redirectTo: $redirectTo)
    }
`);

type LoginOption = 'deactivated' | 'none' | 'email' | 'password';
type ResetPasswordResult = 'success' | 'error' | 'notFound';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginMethod, setLoginMethod] = useState<LoginOption>();
    const [resetPasswordResult, setResetPasswordResult] = useState<ResetPasswordResult>();
    const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [showEmailSent, setShowEmailSent] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const { t } = useTranslation();
    const { trackEvent, trackPageView } = useMatomo();
    const { loginWithGoogle } = useLoginWithIDP();
    const location = useLocation();
    const navigate = useNavigate();
    const { sessionState, loginWithPassword, roles, logout } = useApollo();
    const [determineLoginOptions, { loading: isDeterminingLoginOptions }] = useMutation(DETERMINE_LOGIN_OPTIONS_MUTATION);
    const [resetPassword, { loading: isResettingPassword }] = useMutation(RESET_PASSWORD_MUTATION);
    const [requestToken, { loading: isRequestingToken }] = useMutation(REQUEST_TOKEN_MUTATION);

    const locationState = location.state as { retainPath?: string; error?: 'token-invalid' };
    const retainPath = locationState?.retainPath ?? '/start';
    const error = locationState?.error;

    const getFormDisabledReason = () => {
        if (!email) {
            return t('reasonsDisabled.fieldEmpty');
        }
        if (!isEmail(email)) {
            return t('reasonsDisabled.invalidEMail');
        }
        if (loginMethod === 'password' && !password) {
            return t('reasonsDisabled.formIncomplete');
        }
        return '';
    };

    const handleOnLoginFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (loginMethod === 'password') {
            await handleOnLoginWithPassword();
            return;
        }

        const response = await determineLoginOptions({ variables: { email } });
        const loginOption = response.data?.userDetermineLoginOptions;
        if (loginOption === 'deactivated') {
            setShowDeactivatedModal(true);
        } else if (loginOption === 'password') {
            setLoginMethod('password');
            setLoginEmail(email);
        } else if (loginOption === 'email') {
            await handleOnLoginWithEmailToken();
        } else {
            setEmailError(t('login.accountNotFound.alert_html', { email: email }));
        }
    };

    const handleOnLoginWithPassword = async () => {
        trackEvent({
            category: 'login',
            action: 'click-event',
            name: 'Login Button auf Login Page',
            documentTitle: 'Login Page',
        });
        setIsAuthenticating(true);
        const response = await loginWithPassword(email!, password!, getOrCreateDeviceId());
        if (response.errors) {
            setPasswordError(t('login.invalidPasswordError'));
        }
        setIsAuthenticating(false);
    };

    const handleOnLoginWithEmailToken = async () => {
        const response = await requestToken({
            variables: {
                email: email!,
                redirectTo: retainPath,
            },
        });
        const tokenRequest = response.data?.tokenRequest;

        if (tokenRequest) {
            setShowEmailSent(true);
        } else if (response.errors) {
            if (response.errors[0]?.message.includes('Unknown User')) {
                setEmailError(t('login.accountNotFound.alert_html', { email: email }));
            } else {
                setShowEmailSent(true);
            }
        }
    };

    const handleOnResetPassword = async () => {
        try {
            const res = await resetPassword({
                variables: {
                    email,
                    redirectTo: REDIRECT_PASSWORD,
                },
            });

            if (res.data!.tokenRequest) {
                setResetPasswordResult('success');
            } else if (res.errors) {
                if (res.errors[0].message.includes('Unknown User')) {
                    setResetPasswordResult('notFound');
                } else {
                    setResetPasswordResult('error');
                }
            }
        } catch (e: any) {
            if (e.message.includes('Unknown User')) {
                setResetPasswordResult('notFound');
            } else {
                setResetPasswordResult('error');
            }
        } finally {
            setShowForgotPasswordModal(false);
        }
    };

    const handleTrackToRegistration = () => {
        trackEvent({
            category: 'login',
            action: 'click-event',
            name: 'Registrierung auf Login Page',
            documentTitle: 'Login Page – Registrierung Link',
        });
    };

    useEffect(() => {
        trackPageView({
            documentTitle: 'Login',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loginEmail) {
            if (loginEmail !== email) {
                setLoginMethod(undefined);
                setPassword('');
            }
        }
        setResetPasswordResult(undefined);
        setShowEmailSent(false);
        setEmailError('');
    }, [email, loginEmail]);

    useEffect(() => {
        setPasswordError('');
        setResetPasswordResult(undefined);
    }, [password]);

    useEffect(() => {
        if (sessionState === 'logged-in') navigate(retainPath, { replace: true });
        if (error && error === 'token-invalid') {
            toast.error(t('login.invalidTokenAlert.text'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, sessionState]);

    useEffect(() => {
        if (roles.includes('SSO_REGISTERING_USER')) {
            logout();
        }
    }, [roles, logout]);

    return (
        <div className="bg-primary-lighter flex flex-col h-dvh justify-between flex-1 overflow-y-auto pb-10">
            <div className="flex flex-col flex-1">
                <div className="py-2 pr-4 pl-6 flex justify-end mb-6">
                    <SwitchLanguageButton variant="dropdown" />
                </div>
                <div className="flex flex-1 flex-col items-center justify-center">
                    {!loginMethod && (
                        <div className="flex justify-center mb-8 ml-24">
                            <WelcomeLoki />
                        </div>
                    )}
                    {!!loginMethod && (
                        <Typography className="mb-[60px]" variant="h2">
                            {t('login.title')}
                        </Typography>
                    )}
                    <form
                        onSubmit={handleOnLoginFormSubmit}
                        className="flex flex-col justify-center px-6 gap-y-4 w-full sm:max-w-[342px] justify-self-center mb-14"
                    >
                        <div className="flex flex-col gap-y-[6px] w-full">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                errorMessage={emailError}
                                errorMessageClassName={cn('min-h-[36px] md:min-h-auto', { hidden: loginMethod === 'password' })}
                                variant="white"
                                id="email"
                                placeholder="email@example.com"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </div>
                        {loginMethod === 'password' && (
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col w-full gap-y-[6px]">
                                    <Label htmlFor="password">{t('password')}</Label>
                                    <div className="flex flex-col">
                                        <Input
                                            errorMessage={passwordError}
                                            errorMessageClassName={cn({ hidden: !passwordError })}
                                            autoFocus
                                            type="password"
                                            variant="white"
                                            id="password"
                                            value={password}
                                            onChangeText={setPassword}
                                            className="mb-[6px]"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="link"
                                    className={cn('font-normal text-form inline size-auto p-0 w-fit', { 'mb-5': !passwordError })}
                                    onClick={() => setShowForgotPasswordModal(true)}
                                >
                                    <span className="underline underline-offset-[1px] decoration-1">{t('login.forgotPassword')}</span>
                                </Button>
                            </div>
                        )}
                        {resetPasswordResult && (
                            <Alert className="w-full" variant={resetPasswordResult === 'success' ? 'success' : 'destructive'}>
                                {resetPasswordResult === 'success' && t('login.passwordReset.alert.success')}
                                {resetPasswordResult === 'notFound' && t('login.passwordReset.alert.mailNotFound')}
                                {resetPasswordResult === 'error' && t('login.passwordReset.alert.error')}
                            </Alert>
                        )}
                        {showEmailSent && (
                            <Alert className="w-full" variant="success">
                                {t('login.email.sent')}
                            </Alert>
                        )}
                        <div className="flex flex-col gap-y-5 w-full text-center">
                            <Button
                                size="lg"
                                type="submit"
                                className="w-full"
                                rightIcon={<IconMail size={16} />}
                                disabled={!!getFormDisabledReason()}
                                reasonDisabled={getFormDisabledReason()}
                                isLoading={isDeterminingLoginOptions || isRequestingToken || isAuthenticating}
                            >
                                {t('login.loginWith', { method: t('email') })}
                            </Button>
                            {GOOGLE_CLIENT_ID && (
                                <>
                                    <Typography className="font-medium capitalize">{t('or')}</Typography>
                                    <Button
                                        size="lg"
                                        disabled={isDeterminingLoginOptions || isRequestingToken || isAuthenticating}
                                        type="button"
                                        className="w-full"
                                        variant="optional"
                                        rightIcon={<IconBrandGoogleFilled size={16} />}
                                        onClick={loginWithGoogle}
                                    >
                                        {t('login.loginWith', { method: 'Google' })}
                                    </Button>
                                </>
                            )}
                        </div>
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
            <InformationModal
                variant="destructive"
                isOpen={showDeactivatedModal}
                onOpenChange={setShowDeactivatedModal}
                headline={<span className="block text-center">{t('login.accountDeactivated.title')}</span>}
            >
                <Typography className="text-pretty text-center">{t('login.accountDeactivated.alert_html')}</Typography>
            </InformationModal>
            <ConfirmationModal
                isOpen={showForgotPasswordModal}
                onOpenChange={setShowForgotPasswordModal}
                headline={t('login.passwordReset.btn')}
                description={t('login.passwordReset.description', { email })}
                confirmButtonText={t('login.passwordReset.btn')}
                onConfirm={handleOnResetPassword}
                isLoading={isResettingPassword}
            />
        </div>
    );
};

export default Login;
