import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigationStack } from '../hooks/useNavigationStack';
import { Button } from './Button';
import { IconArrowLeft } from '@tabler/icons-react';

type Props = {
    onPress?: () => any;
    previousFallbackRoute?: string;
};

const BackButton: React.FC<Props> = ({ onPress, previousFallbackRoute: fallback }) => {
    const navigate = useNavigate();
    const { navigationStack, popRoute } = useNavigationStack();
    const location = useLocation();

    const handleOnBack = () => {
        if (onPress) {
            onPress();
            return;
        }
        // A default route is when there is no back route (i.e open the app in a new tab, or coming from an external link)
        const isDefaultRoute = location.key === 'default';

        // -1 is the current one
        const previousRoute = navigationStack[navigationStack.length - 2]?.pathname;
        const isPreviousRouteValid = previousRoute && ![location.pathname, '/login', '/welcome', '/registration'].includes(previousRoute);
        const shouldRouteAlwaysUseFallback = [
            '/settings',
            '/notifications/system',
            '/notifications/newsletter',
            '/knowledge-pupil/learn-methods',
            '/knowledge-helper/handbook',
            '/knowledge-helper/online-training',
        ].includes(location.pathname);
        if ((isDefaultRoute || !isPreviousRouteValid || shouldRouteAlwaysUseFallback) && !!fallback) {
            navigate(fallback);
            popRoute();
            return;
        }

        navigate(-1);
    };
    return (
        <Button variant="none" size="icon" onClick={handleOnBack}>
            <IconArrowLeft size={24} />
        </Button>
    );
};
export default BackButton;
