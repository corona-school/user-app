import { GOOGLE_CLIENT_ID } from '@/config';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

const useLoginWithIDP = () => {
    const loginWithGoogle = () => {
        const AUTH_URL = `${GOOGLE_AUTH_URL}?${new URLSearchParams({
            prompt: 'consent',
            response_type: 'code',
            client_id: GOOGLE_CLIENT_ID,
            scope: 'openid profile email',
            enable_granular_consent: 'true',
            redirect_uri: `${window.location.origin}/login-with`,
        }).toString()}`;
        window.location.href = AUTH_URL;
    };
    return { loginWithGoogle };
};

export default useLoginWithIDP;
