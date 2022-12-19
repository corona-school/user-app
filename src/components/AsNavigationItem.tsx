import { ReactNode, useEffect } from 'react';
import useLernfair from '../hooks/useLernfair';

type Props = {
    path: string;
    children: ReactNode | ReactNode[];
};

const AsNavigationItem: React.FC<Props> = ({ path, children }) => {
    const { setRootPath } = useLernfair();

    useEffect(() => {
        setRootPath && setRootPath(path);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{children}</>;
};
export default AsNavigationItem;
