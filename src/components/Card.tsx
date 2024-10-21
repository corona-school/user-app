import { Card as BaseCard } from 'native-base';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode | ReactNode[];
    flexibleWidth?: boolean;
    variant?: 'normal' | 'dark';
    isFullHeight?: boolean;
    width?: number | string;
    padding?: number | string;
    margin?: number | string;
};

const Card: React.FC<Props> = ({ children, flexibleWidth = false, variant = 'normal', isFullHeight = true, width, padding, margin }) => {
    const p: { flex?: number } = {};

    if (isFullHeight) {
        p.flex = 1;
    }

    return (
        <BaseCard
            shadow="none"
            bg={variant === 'normal' ? 'primary.100' : 'primary.900'}
            borderRadius={8}
            padding={padding ? padding : 0}
            w={width ? width : flexibleWidth ? 'auto' : '250'}
            margin={margin ? margin : 0}
            {...p}
        >
            {children}
        </BaseCard>
    );
};
export default Card;
