import { ReactNode } from 'react';

type Props = {
    className: string;
    children: ReactNode | ReactNode[];
    style?: Object;
};

/**
 * This wrapper component is used to apply css in places where native it not applicable or hard to achieve.
 * There is a *.native file that was a fallback for natives contexts
 */
const CSSWrapper: React.FC<Props> = ({ className, children, style }) => {
    return (
        <div className={className} style={style}>
            {children}
        </div>
    );
};
export default CSSWrapper;
