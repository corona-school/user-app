import { SsoAuthStatus } from '@/gql/graphql';
import LinkIDPModal from '@/modals/LinkIDPModal';
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
        } catch (error) {
            toast.error(t('login.linkAccountWithIdpError'));
            navigate('/');
        }
    };

    useEffect(() => {
        if (code) {
            handleOnLoginWithSSO(code);
        }
    }, [code]);

    if (roles.includes('USER')) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <CenterLoadingSpinner />
            <LinkIDPModal isOpen={showReauthenticate} onOpenChange={setShowReauthenticate} />
        </>
    );
};
export default LoginWithIDP;
