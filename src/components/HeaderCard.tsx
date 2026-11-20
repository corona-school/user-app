import { ReactNode } from 'react';
import BackButton from './BackButton';
import { NavLink } from 'react-router-dom';
import Loki from '../assets/icons/loki.svg';
import { cn } from '@/lib/Tailwind';

type Props = {
    children?: ReactNode | ReactNode[];
    title?: string;
    leftContent?: ReactNode | ReactNode[];
    rightContent?: ReactNode | ReactNode[];
    onBack?: () => any;
    showBack?: boolean;
    // Shows the back button next to the logo on mobile only (e.g. on pages with a breadcrumb)
    showBackOnMobile?: boolean;
    previousFallbackRoute?: string;
};

/**
 * Is used to display views below the scrollable header seamlessly.
 * -  use `leftContent`and `rightContent` to display content on either side
 * - `showBack` / `onBack` to use navigation in here
 * - `showBackOnMobile` to show the back button next to the logo on mobile, desktop only shows the logo
 */
const HeaderCard: React.FC<Props> = ({ children, leftContent, rightContent, onBack, showBack, showBackOnMobile, previousFallbackRoute }) => {
    return (
        <div className="h-14">
            <div className="h-14 bg-primary-light fixed py-4 z-50 top-0 left-0 right-0">
                <div className="flex items-center justify-between h-full px-4">
                    <div className="flex items-center">
                        <div className={cn(!showBack && (showBackOnMobile ? 'md:hidden' : 'invisible hidden'))}>
                            <BackButton onPress={onBack} previousFallbackRoute={previousFallbackRoute} />
                        </div>
                        {!showBack && (
                            <NavLink to="/start" className="ml-1">
                                <Loki className="w-[106px] h-[34px] lg:w-[125px] lg:h-[40px]" />
                            </NavLink>
                        )}
                    </div>
                    <div className="flex flex-row items-center w-full justify-end">
                        <div>{leftContent}</div>
                        <div className="flex flex-row items-center md:hidden">{rightContent}</div>
                        <div className="hidden md:flex">{rightContent}</div>
                    </div>
                </div>
            </div>
            {children && <div className="px-4 pt-14 lg:hidden">{children}</div>}
        </div>
    );
};

export default HeaderCard;
