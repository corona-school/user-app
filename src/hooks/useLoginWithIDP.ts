import { GOOGLE_CLIENT_ID } from '@/config';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

const useLoginWithIDP = () => {
    const loginWithGoogle = () => {
        setTimeout(() => {
            const AUTH_URL = `${GOOGLE_AUTH_URL}?${new URLSearchParams({
                prompt: 'consent',
                response_type: 'code',
                client_id: GOOGLE_CLIENT_ID,
                scope: 'openid profile email',
                enable_granular_consent: 'true',
                redirect_uri: `${window.location.origin}/login-with`,
                state: JSON.stringify({ referrer: 'https://accounts.google.com/' }),
            }).toString()}`;
            window.location.href = AUTH_URL;
        }, 0);
    };
    return { loginWithGoogle };
};

export default useLoginWithIDP;
