import HeaderCard from './HeaderCard';
import { NavigationItems } from '../types/navigation';
import BottomNavigationBar from './BottomNavigationBar';
import { ReactNode } from 'react';
import SideBarMenu from './SideBarMenu';
import SettingsButton from './SettingsButton';
import CenterLoadingSpinner from './CenterLoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';
import InstallAppBanner from '../widgets/InstallAppBanner';
import { IconHome2, IconCalendarClock, IconMessage, IconUsersGroup, IconUsers, IconBook2, IconSpeakerphone } from '@tabler/icons-react';
import { REFERRALS_ACTIVE } from '@/config';
import { cn } from '@/lib/Tailwind';

type Props = {
    children?: ReactNode | ReactNode[];
    headerLeft?: ReactNode | ReactNode[];
    headerRight?: ReactNode | ReactNode[];
    headerContent?: ReactNode | ReactNode[];
    headerTitle?: string;
    isSidebarMenu?: boolean;
    showBack?: boolean;
    previousFallbackRoute?: string;
    hideMenu?: boolean;
    isLoading?: boolean;

    onBack?: () => any;
    classes?: {
        contentContainerClassName?: string;
    };
};

const WithNavigation: React.FC<Props> = ({
    children,
    headerLeft,
    headerRight,
    headerContent,
    headerTitle,
    isSidebarMenu = true,
    showBack,
    hideMenu,
    isLoading,
    previousFallbackRoute,
    classes: { contentContainerClassName } = { contentContainerClassName: '' },
    onBack,
}) => {
    const { unreadMessagesCount } = useChat();

    const { t } = useTranslation();

    const navItems: NavigationItems = {
        start: { label: t('navigation.label.start'), icon: IconHome2 },
        appointments: { label: t('navigation.label.appointments'), icon: IconCalendarClock },
        chat: { label: t('navigation.label.chat'), icon: IconMessage },
        group: { label: t('navigation.label.group'), icon: IconUsersGroup },
        matching: { label: t('navigation.label.matching'), icon: IconUsers },
        'knowledge-helper': {
            label: t('navigation.label.forStudents'),
            icon: IconBook2,
        },
        'knowledge-pupil': {
            label: t('navigation.label.forPupils'),
            icon: IconBook2,
        },
        ...(REFERRALS_ACTIVE ? { referral: { label: t('navigation.label.referral'), icon: IconSpeakerphone } } : {}),
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <HeaderCard
                onBack={onBack}
                showBack={showBack}
                leftContent={headerLeft}
                rightContent={headerRight || (isSidebarMenu && !hideMenu ? <SettingsButton /> : '')}
                title={headerTitle}
                previousFallbackRoute={previousFallbackRoute}
            >
                {headerContent}
            </HeaderCard>
            <div className="flex flex-1 min-h-0">
                {!hideMenu && <SideBarMenu navItems={navItems} unreadMessagesCount={unreadMessagesCount} />}
                <div className="overflow-x-auto overflow-y-hidden flex-1">
                    {(!isLoading && (
                        <>
                            <>
                                <div className="lg:hidden">{headerContent}</div>
                                {!hideMenu && (
                                    <div className="lg:hidden">
                                        <InstallAppBanner />
                                    </div>
                                )}
                            </>
                            <div className={cn('p-4 lg:px-8 lg:py-4 h-full overflow-y-auto', contentContainerClassName)}>{children}</div>
                        </>
                    )) || <CenterLoadingSpinner />}
                </div>
            </div>
            {!hideMenu && <BottomNavigationBar navItems={navItems} unreadMessagesCount={unreadMessagesCount} />}
        </div>
    );
};
export default WithNavigation;
