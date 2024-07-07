import { useCallback, useContext } from 'react';
import { WebPushContext } from '../context/WebPushProvider';
import useApollo from './useApollo';
import { logError } from '../log';
import { WEBPUSH_ACTIVE } from '../config';

const useLogout = () => {
    const { logout } = useApollo();
    const { unsubscribe } = useContext(WebPushContext);
    const execute = useCallback(async () => {
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
    return execute;
};

export default useLogout;
