import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import useApollo from '../hooks/useApollo';

const LoginToken: React.FC = () => {
    const navigate = useNavigate();
    const { sessionState } = useApollo();
    const [searchParams] = useSearchParams();

    const redirectTo = searchParams?.get('redirectTo');
    const redirectEncoded = redirectTo ? window.atob(redirectTo) : '/start';

    useEffect(() => {
        if (sessionState === 'logged-in') {
            navigate(redirectEncoded);
        }
        if (sessionState === 'error') {
            navigate('/login', { state: { error: 'token-invalid' } });
        }
    }, [navigate, sessionState, redirectEncoded]);

    return <CenterLoadingSpinner />;
};
export default LoginToken;
