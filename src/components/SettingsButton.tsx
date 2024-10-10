import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { IconMenu2 } from '@tabler/icons-react';

type Props = {};

const SettingsButton: React.FC<Props> = () => {
    const navigate = useNavigate();
    return (
        <Button className="rounded-full hover:bg-primary-light hover:brightness-105" variant="none" onClick={() => navigate('/settings')} size="icon">
            <IconMenu2 size={24} />
        </Button>
    );
};
export default SettingsButton;
