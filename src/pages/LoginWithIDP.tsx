import { SsoAuthStatus } from '@/gql/graphql';
import { logError } from '@/log';
import LinkIDPModal from '@/modals/LinkIDPModal';
import { ApolloError, isApolloError } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import useApollo from '../hooks/useApollo';

const LoginWithIDP = () => {
    const { t } = useTranslation();
    const [showReauthenticate, setShowReauthenticate] = useState(false);
    const { roles, loginWithSSO } = useApollo();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const handleOnLoginWithSSO = async (idpCode: string) => {
        try {
            const ssoStatus = await loginWithSSO(idpCode);
            if (ssoStatus === SsoAuthStatus.Register) {
                navigate('/registration');
            }

            if (ssoStatus === SsoAuthStatus.Link) {
                setShowReauthenticate(true);
            }

            if (ssoStatus === SsoAuthStatus.Error) {
                navigate('/');
            }
        } catch (e) {
            if (isApolloError(e as Error)) {
                const [error] = (e as ApolloError).graphQLErrors;
                if (error?.extensions?.code === 'PREREQUISITE') {
                    toast.error(t('login.linkAccountWithIdpError'));
                } else {
                    toast.error(t('error'));
                    logError('loginWithSSO', error.message, JSON.stringify(error));
                }
            } else {
                toast.error(t('error'));
                logError('loginWithSSO', (e as Error)?.message, JSON.stringify(e));
            }
            navigate('/');
        }
    };

    useEffect(() => {
        if (code) {
            handleOnLoginWithSSO(code);
        }
    }, [code]);

    useEffect(() => {
        if (error) {
            if (error !== 'access_denied') {
                logError('LoginWithIDP', error);
                toast.error(t('error'));
            }
            navigate('/login');
        }
    }, [error]);

    if (roles.includes('USER')) {
        return <Navigate to="/" />;
    }

    if (error) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <CenterLoadingSpinner />
            <LinkIDPModal isOpen={showReauthenticate} onOpenChange={setShowReauthenticate} />
        </>
    );
};
export default LoginWithIDP;
