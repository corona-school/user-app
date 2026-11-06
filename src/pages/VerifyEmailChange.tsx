import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../assets/icons/logo.svg';
import useApollo from '../hooks/useApollo';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';

const VerifyEmailChange: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams?.get('redirectTo');
    const redirectEncoded = redirectTo ? window.atob(redirectTo) : '/';

    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const { sessionState } = useApollo();

    useEffect(() => {
        if (sessionState === 'logged-in') {
            setShowSuccess(true);
        }
        if (sessionState === 'error') {
            navigate('/login', { state: { error: 'token-invalid' } });
        }
    }, [navigate, sessionState]);

    return (
        <div className="flex flex-col min-h-dvh bg-primary-lighter p-4">
            <div className="flex flex-col flex-1 w-full lg:max-w-2xl mx-auto items-center justify-center gap-y-6">
                <Logo />
                <Typography variant="h4" className="text-center text-primary">
                    {t('login.emailVerification')}
                </Typography>
                {showSuccess ? (
                    <>
                        <Typography className="text-primary text-center">{t('login.succesEmailVerification')}</Typography>
                        <Button onClick={() => navigate(redirectEncoded, { state: {} })}>{t('continue')}</Button>
                    </>
                ) : (
                    <Typography className="text-primary text-center">{t('login.invalidToken')}</Typography>
                )}
            </div>
        </div>
    );
};
export default VerifyEmailChange;
