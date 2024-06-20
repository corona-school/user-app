import { View, useBreakpointValue, useTheme, Row, Column, Box } from 'native-base';
import HeaderCard from './HeaderCard';
import { NavigationItems } from '../types/navigation';
import BottomNavigationBar from './BottomNavigationBar';
import { ReactNode } from 'react';

import LFHomeIcon from '../assets/icons/lernfair/lf-home.svg';
import LFAppointmentIcon from '../assets/icons/lernfair/lf-calendar.svg';
import LFMatchingIcon from '../assets/icons/lernfair/lf-1-1.svg';
import LFGroupIcon from '../assets/icons/lernfair/lf-course.svg';
import LFChatIcon from '../assets/icons/lernfair/lf-chat.svg';
import LFKnowledgeIcon from '../assets/icons/lernfair/lf-knowledge.svg';
import SideBarMenu from './SideBarMenu';
import SettingsButton from './SettingsButton';
import CenterLoadingSpinner from './CenterLoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';
import InstallAppBanner from '../widgets/InstallAppBanner';

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
    const { space, colors } = useTheme();
    const isMobile = useBreakpointValue({
        base: true,
        md: false,
    });

    const isMobileOrTablet = useBreakpointValue({
        base: true,
        lg: false,
    });

    const innerPaddingContent = useBreakpointValue({
        base: 0,
        lg: space['1'],
    });

    const { unreadMessagesCount } = useChat();

    const { t } = useTranslation();

    const navItems: NavigationItems = {
        start: { label: t('navigation.label.start'), icon: LFHomeIcon },
        appointments: { label: t('navigation.label.appointments'), icon: LFAppointmentIcon },
        chat: { label: t('navigation.label.chat'), icon: LFChatIcon },
        group: { label: t('navigation.label.group'), icon: LFGroupIcon },
        matching: { label: t('navigation.label.matching'), icon: LFMatchingIcon },
        'knowledge-helper': {
            label: t('navigation.label.forStudents'),
            icon: ({ isActive }) => <LFKnowledgeIcon color={isActive ? 'white' : colors['primary']['900']} />,
        },
        'knowledge-pupil': {
            label: t('navigation.label.forPupils'),
            icon: ({ isActive }) => <LFKnowledgeIcon color={isActive ? 'white' : colors['primary']['900']} />,
        },
    };

    return (
        <View flex="1">
            <View flex="1" display="flex" flexDirection="column" flexWrap="nowrap" overflow="hidden" w="100vw" h="100%" flexBasis="auto" flexGrow="1">
                <HeaderCard
                    onBack={onBack}
                    showBack={showBack}
                    leftContent={headerLeft}
                    rightContent={headerRight || (isSidebarMenu && !hideMenu ? <SettingsButton /> : '')}
                    title={headerTitle}
                    previousFallbackRoute={previousFallbackRoute}
                >
                    {!isMobile && headerContent}
                </HeaderCard>
                <Box flex={1} position="static">
                    <Row maxW="100%" flexWrap={'wrap'} overflow="hidden" flex="1" overflowY="scroll" position="static">
                        {!hideMenu && (
                            <Column>
                                <SideBarMenu show={!isMobile} navItems={navItems} paddingTop={'72px'} unreadMessagesCount={unreadMessagesCount} />
                            </Column>
                        )}
                        <Column flex="1" padding={innerPaddingContent} height="100%" position="static">
                            {(!isLoading && (
                                <>
                                    <Box mb={4} position="static">
                                        {isMobile && <>{headerContent}</>}
                                        {isMobileOrTablet && !hideMenu && <InstallAppBanner />}
                                    </Box>
                                    {children}
                                </>
                            )) || <CenterLoadingSpinner />}
                        </Column>
                    </Row>
                </Box>
            </View>
            {!hideMenu && <BottomNavigationBar show={isMobile} navItems={navItems} unreadMessagesCount={unreadMessagesCount} />}
        </View>
    );
};
export default WithNavigation;
