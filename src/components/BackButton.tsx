import { ArrowBackIcon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigationStack } from '../hooks/useNavigationStack';

type Props = {
    onPress?: () => any;
    previousFallbackRoute?: string;
};

const BackButton: React.FC<Props> = ({ onPress, previousFallbackRoute: fallback }) => {
    const navigate = useNavigate();
    const { navigationStack } = useNavigationStack();
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
        const shouldRouteAlwaysUseFallback = ['/settings'].includes(location.pathname);
        if ((isDefaultRoute || !isPreviousRouteValid || shouldRouteAlwaysUseFallback) && !!fallback) {
            navigate(fallback);
            return;
        }

        navigate(-1);
    };
    return (
        <TouchableOpacity onPress={handleOnBack}>
            <ArrowBackIcon size="xl" color="lightText" />
        </TouchableOpacity>
    );
};
export default BackButton;
