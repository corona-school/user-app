import useApollo from '../hooks/useApollo';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();
    const { logout } = useApollo();
    logout();
    navigate('/welcome');

    return null;
}
