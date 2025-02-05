import { SsoAuthStatus } from '@/gql/graphql';
import LinkIDPModal from '@/modals/LinkIDPModal';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import useApollo from '../hooks/useApollo';

const LoginWithIDP = () => {
    const [showReauthenticate, setShowReauthenticate] = useState(false);
    const { roles, loginWithSSO } = useApollo();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const code = searchParams.get('code');

    const handleOnLoginWithSSO = useCallback(
        async (idpCode: string) => {
            const ssoStatus = await loginWithSSO(idpCode);

            if (roles.includes('SSO_REGISTERING_USER') && ssoStatus === SsoAuthStatus.Register) {
                navigate('/registration');
            }

            if (ssoStatus === SsoAuthStatus.Link) {
                setShowReauthenticate(true);
            }

            if (roles.includes('USER')) {
                navigate('/');
            }
        },
        [loginWithSSO, roles, navigate]
    );

    useEffect(() => {
        if (code) {
            handleOnLoginWithSSO(code);
        }
    }, [code, handleOnLoginWithSSO]);

    return (
        <>
            <CenterLoadingSpinner />
            <LinkIDPModal isOpen={showReauthenticate} onOpenChange={setShowReauthenticate} />
        </>
    );
};
export default LoginWithIDP;
