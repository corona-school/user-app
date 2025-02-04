import { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import useApollo from '../hooks/useApollo';

const LoginWith: React.FC = () => {
    const { roles, loginWithSSO } = useApollo();
    const [searchParams] = useSearchParams();

    const code = searchParams.get('code');
    useEffect(() => {
        if (code) {
            loginWithSSO(code);
        }
    }, [code]);

    if (roles.includes('SSO_REGISTERING_USER')) {
        return <Navigate to="/registration" />;
    }

    if (roles.includes('USER')) {
        return <Navigate to="/" />;
    }

    return <CenterLoadingSpinner />;
};
export default LoginWith;
