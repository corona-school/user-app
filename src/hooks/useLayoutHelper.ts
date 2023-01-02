import { useBreakpointValue } from 'native-base';

export const useLayoutHelper = () => {
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    return { isMobile };
};
