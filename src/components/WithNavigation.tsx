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
import { IconHome2, IconCalendarClock, IconMessage, IconUsersGroup, IconUsers, IconBook2 } from '@tabler/icons-react';

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
        referral: { label: t('navigation.label.referral'), icon: IconUsers },
    };

    return (
        <div className="flex flex-col flex-1">
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
            <div className="flex flex-1">
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
                            <div className="p-4 lg:p-6 h-full">{children}</div>
                        </>
                    )) || <CenterLoadingSpinner />}
                </div>
            </div>
            {!hideMenu && <BottomNavigationBar navItems={navItems} unreadMessagesCount={unreadMessagesCount} />}
        </div>
    );
};
export default WithNavigation;
