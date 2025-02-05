import { SsoAuthStatus } from '@/gql/graphql';
import LinkIDPModal from '@/modals/LinkIDPModal';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import useApollo from '../hooks/useApollo';

const LoginWithIDP = () => {
    const [showReauthenticate, setShowReauthenticate] = useState(false);
    const { roles, loginWithSSO } = useApollo();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const code = searchParams.get('code');

    const handleOnLoginWithSSO = async (idpCode: string) => {
        const ssoStatus = await loginWithSSO(idpCode);
        if (ssoStatus === SsoAuthStatus.Register) {
            navigate('/registration');
        }

        if (ssoStatus === SsoAuthStatus.Link) {
            setShowReauthenticate(true);
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
