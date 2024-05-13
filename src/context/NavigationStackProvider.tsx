import { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigationType, Location } from 'react-router-dom';

interface NavigationStackContextValue {
    navigationStack: Location[];
    popRoute: () => void;
    pushRoute: () => void;
    replaceRoute: () => void;
}

export const NavigationStackContext = createContext<NavigationStackContextValue>({
    navigationStack: [],
    popRoute: () => {},
    pushRoute: () => {},
    replaceRoute: () => {},
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

    const popRoute = () => {
        setNavigationStack((stack) => stack.slice(0, -1));
    };

    const pushRoute = () => {
        setNavigationStack((stack) => stack.concat(location));
    };

    const replaceRoute = () => {
        setNavigationStack((stack) => stack.slice(0, -1).concat(location));
    };

    return <NavigationStackContext.Provider value={{ navigationStack, popRoute, pushRoute, replaceRoute }}>{children}</NavigationStackContext.Provider>;
};

export default NavigationStackProvider;
