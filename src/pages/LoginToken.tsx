import { gql } from './../gql';
import { useMutation } from '@apollo/client';
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
    const redirectEncoded = redirectTo ? window.atob(redirectTo) : '/start';

    const [loginToken, loginTokenResult] = useMutation(
        gql(`
        mutation LoginToken2($token: String!) {
            loginToken(token: $token)
        }
    `)
    );

    const login = useCallback(async () => {
        try {
            log('LoginToken', 'Trying to log in with token');
            const res = await loginToken({ variables: { token: token! } });
            log('LoginToken', 'Successfully logged in with token');
            onLogin(res);
            navigate(redirectEncoded);
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
