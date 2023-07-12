import { Button } from 'native-base';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '../assets/icons/icon_settings.svg';

type Props = {};

const SettingsButton: React.FC<Props> = () => {
    const navigate = useNavigate();
    return (
        <Button variant={'ghost'} onPress={() => navigate('/settings')}>
            <SettingsIcon />
        </Button>
    );
};
export default SettingsButton;
