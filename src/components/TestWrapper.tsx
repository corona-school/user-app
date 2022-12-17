import { ReactNode } from 'react';
import { NativeBaseProvider } from 'native-base';
import Theme from '../Theme';

type Props = {
    children: ReactNode;
};

const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const TestWrapper: React.FC<Props> = ({ children }) => {
    return (
        <NativeBaseProvider theme={Theme} initialWindowMetrics={inset}>
            {children}
        </NativeBaseProvider>
    );
};
export default TestWrapper;
