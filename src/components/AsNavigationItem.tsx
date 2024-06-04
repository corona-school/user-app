import { ReactNode, useEffect } from 'react';
import useLernfair from '../hooks/useLernfair';

type Props = {
    path: string;
    children: ReactNode | ReactNode[];
};

/**
 * It allows to control the active navigation path by using a effect to set `rootPath`on initial rendering
 */
const AsNavigationItem: React.FC<Props> = ({ path, children }) => {
    const { setRootPath } = useLernfair();

    useEffect(() => {
        setRootPath && setRootPath(path);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{children}</>;
};
export default AsNavigationItem;
