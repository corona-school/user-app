import { Text, Box, Heading, Stack, useBreakpointValue, useTheme } from 'native-base';
import AsNavigationItem from '../components/AsNavigationItem';
import HelpNavigation from '../components/HelpNavigation';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import Tabs from '../components/Tabs';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const tabs = ['learn-methods'];

const ForPupils = () => {
    const { t } = useTranslation();
    const { sizes, space } = useTheme();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const containerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const contentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const currentTabFromRoute = pathname.split('/').pop();
    const currentTabIndex = tabs.indexOf(currentTabFromRoute || 'learn-methods');
    return (
        <AsNavigationItem path="knowledge-pupil">
            <WithNavigation
                showBack={isMobile}
                previousFallbackRoute="/start"
                headerTitle={t('forPupils.title')}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                <Box maxWidth={containerWidth} width="100%" marginX="auto">
                    <Box maxWidth={contentContainerWidth} paddingBottom={space['1.5']} paddingX={space['1.5']}>
                        <Heading paddingBottom={1.5}>{t('forPupils.title')}</Heading>
                        <Text>{t('forPupils.description')}</Text>
                    </Box>
                </Box>
                <Box width="100%" maxWidth={containerWidth} marginX="auto" flex={1}>
                    <Tabs
                        currentTabIndex={currentTabIndex !== -1 ? currentTabIndex : 0}
                        onPressTab={(tab) => navigate(`${tab.id}`)}
                        tabs={[
                            {
                                id: 'learn-methods',
                                title: t('forPupils.tabs.learnMethods'),
                                content: <Outlet />,
                            },
                        ]}
                    />
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default ForPupils;
