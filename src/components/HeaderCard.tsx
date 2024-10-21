import { ReactNode } from 'react';
import BackButton from './BackButton';
import { NavLink } from 'react-router-dom';
import Loki from '../assets/icons/loki.svg';

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
const HeaderCard: React.FC<Props> = ({ children, leftContent, rightContent, onBack, showBack, previousFallbackRoute }) => {
    return (
        <div className="h-14">
            <div className="h-14 bg-primary-light fixed py-4 z-50 top-0 left-0 right-0">
                <div className="flex items-center justify-between h-full px-4">
                    <div className="flex items-center">
                        <div className={showBack ? '' : 'invisible hidden'}>
                            <BackButton onPress={onBack} previousFallbackRoute={previousFallbackRoute} />
                        </div>
                        {!showBack && (
                            <NavLink to="/start" className="ml-1">
                                <Loki className="w-[106px] h-[34px] lg:w-[125px] lg:h-[40px]" />
                            </NavLink>
                        )}
                    </div>
                    <div className="flex flex-row items-center justify-end w-full md:hidden">
                        <div className="flex flex-row items-center">
                            {leftContent} {rightContent}
                        </div>
                    </div>
                    <div className="flex-row justify-end hidden md:flex">
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
