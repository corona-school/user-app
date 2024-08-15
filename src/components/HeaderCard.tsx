import { ReactNode } from 'react';
import BackButton from './BackButton';
import { Typography } from './Typography';

type Props = {
    children?: ReactNode | ReactNode[];
    title?: string;
    leftContent?: ReactNode | ReactNode[];
    rightContent?: ReactNode | ReactNode[];
    onBack?: () => any;
    showBack?: boolean;
    previousFallbackRoute?: string;
};

/**
 * Is used to display views below the scrollable header seamlessly.
 * -  use `leftContent`and `rightContent` to display content on either side
 * - `showBack` / `onBack` to use navigation in here
 */
const HeaderCard: React.FC<Props> = ({ children, title, leftContent, rightContent, onBack, showBack, previousFallbackRoute }) => {
    return (
        <div className="h-14">
            <div className="h-14 bg-primary-light fixed py-4 z-50 top-0 left-0 right-0">
                <div className="flex items-center justify-between h-full px-4">
                    <div>{showBack && <BackButton onPress={onBack} previousFallbackRoute={previousFallbackRoute} />}</div>
                    <div className="flex flex-row items-center justify-between w-full lg:hidden">
                        <div>{rightContent}</div>
                        <Typography variant="body" className="text-primary font-semibold text-center lg:hidden">
                            {title}
                        </Typography>
                        <div className="flex flex-row items-center">{leftContent}</div>
                    </div>
                    <div className="flex-row justify-end hidden lg:flex">
                        <div>{leftContent}</div>
                        <div>{rightContent}</div>
                    </div>
                </div>
            </div>
            {children && <div className="px-4 pt-14 lg:hidden">{children}</div>}
        </div>
    );
};

export default HeaderCard;
