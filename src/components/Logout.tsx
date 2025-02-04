import useApollo from '../hooks/useApollo';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useContext, useEffect } from 'react';
import { WebPushContext } from '@/context/WebPushProvider';
import { WEBPUSH_ACTIVE } from '@/config';
import { logError } from '@/log';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';

export default function Logout() {
    const navigate = useNavigate();
    const location = useLocation();
    const locState = location.state as { deactivated?: boolean };

    const useLogout = () => {
        const { logout } = useApollo();
        const { unsubscribe } = useContext(WebPushContext);
        return useCallback(async () => {
            if (WEBPUSH_ACTIVE) {
                try {
                    await unsubscribe();
                } catch (error) {
                    logError('WebPush', 'Failed to unsubscribe', error);
                }
            }
            try {
                await logout();
            } catch (error) {
                logError('Authentication', 'Failed to logout', error);
            }
        }, []);
    };

    const logout = useLogout();
    useEffect(() => {
        logout().then(() => navigate('/welcome', { state: locState }));
    }, []);

    return <CenterLoadingSpinner />;
}
