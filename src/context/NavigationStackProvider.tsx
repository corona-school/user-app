import { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigationType, Location } from 'react-router-dom';

export const NavigationStackContext = createContext<{ navigationStack: Location[] }>({
    navigationStack: [],
});

interface NavigationStackProviderProps {
    children: React.ReactNode;
}

const NavigationStackProvider = ({ children }: NavigationStackProviderProps) => {
    const location = useLocation();
    const navigationType = useNavigationType();
    const [navigationStack, setNavigationStack] = useState<Location[]>([]);

    useEffect(() => {
        setNavigationStack((stack) => {
            switch (navigationType) {
                case 'POP':
                    return stack.slice(0, -1);
                case 'PUSH':
                    return stack.concat(location);
                case 'REPLACE':
                    return stack.slice(0, -1).concat(location);
                default:
                    return stack;
            }
        });
    }, [location]);

    return <NavigationStackContext.Provider value={{ navigationStack }}>{children}</NavigationStackContext.Provider>;
};

export default NavigationStackProvider;
