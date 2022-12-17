import { gql, useMutation } from '@apollo/client';
import { View, Text } from 'native-base';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import useApollo from '../hooks/useApollo';
import { log } from '../log';

type Props = {};

const LoginToken: React.FC<Props> = () => {
    const navigate = useNavigate();
    const { onLogin } = useApollo();
    const [searchParams] = useSearchParams();
    const token = searchParams?.get('secret_token');
    const redirectTo = searchParams?.get('redirectTo');

    const [loginToken, loginTokenResult] = useMutation(gql`
        mutation LoginToken2($token: String!) {
            loginToken(token: $token)
        }
    `);

    const login = useCallback(async () => {
        try {
            log('LoginToken', 'Trying to log in with token');
            const res = await loginToken({ variables: { token } });
            log('LoginToken', 'Successfully logged in with token');
            onLogin(res);
            navigate(redirectTo || '/start');
        } catch (error) {
            log('LoginToken', 'Failed to log in with token ', error);
            navigate('/login');
        }
    }, [loginToken, navigate, redirectTo, token]);

    useEffect(() => {
        login();
    }, [login]);

    return <CenterLoadingSpinner />;
};
export default LoginToken;
