import { SsoAuthStatus } from '@/gql/graphql';
import LinkIDPModal from '@/modals/LinkIDPModal';
import { useCallback, useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import useApollo from '../hooks/useApollo';

const LoginWithIDP = () => {
    const [showReauthenticate, setShowReauthenticate] = useState(false);
    const { roles, loginWithSSO } = useApollo();
    const [ssoStatus, setSsoStatus] = useState<SsoAuthStatus>();
    const [searchParams] = useSearchParams();

    const code = searchParams.get('code');

    const handleOnLoginWithSSO = useCallback(
        async (idpCode: string) => {
            const result = await loginWithSSO(idpCode);
            setSsoStatus(result);
            if (result === SsoAuthStatus.Link) {
                setShowReauthenticate(true);
            }
        },
        [loginWithSSO]
    );

    useEffect(() => {
        if (code) {
            handleOnLoginWithSSO(code);
        }
    }, [code, handleOnLoginWithSSO]);

    if (roles.includes('SSO_REGISTERING_USER') && ssoStatus === SsoAuthStatus.Register) {
        return <Navigate to="/registration" />;
    }

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
