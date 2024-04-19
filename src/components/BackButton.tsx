import { ArrowBackIcon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
    onPress?: () => any;
    previousFallbackRoute?: string;
};

const BackButton: React.FC<Props> = ({ onPress, previousFallbackRoute: fallback }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleOnBack = () => {
        if (onPress) onPress();
        else if (location.key === 'default' && fallback) {
            navigate(fallback, { replace: true });
        } else {
            navigate(-1);
        }
    };
    return (
        <TouchableOpacity onPress={handleOnBack}>
            <ArrowBackIcon size="xl" color="lightText" />
        </TouchableOpacity>
    );
};
export default BackButton;
