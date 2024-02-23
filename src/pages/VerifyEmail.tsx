import { Flex } from 'native-base';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useApollo from '../hooks/useApollo';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams?.get('redirectTo');
    const redirectEncoded = redirectTo ? window.atob(redirectTo) : '/';

    const { sessionState } = useApollo();

    useEffect(() => {
        if (sessionState === 'logged-in') {
            navigate(redirectEncoded, { state: {} });
        }
        if (sessionState === 'error') {
            navigate('/login', { state: { error: 'token-invalid' } });
        }
    }, [navigate, sessionState, redirectEncoded]);

    return (
        <Flex overflowY={'auto'} height="100dvh">
            <CenterLoadingSpinner />
        </Flex>
    );
};
export default VerifyEmail;
