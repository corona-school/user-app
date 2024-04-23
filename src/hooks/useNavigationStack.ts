import { useContext } from 'react';
import { NavigationStackContext } from '../context/NavigationStackProvider';

export const useNavigationStack = () => {
    return useContext(NavigationStackContext);
};
