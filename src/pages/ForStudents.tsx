import { Text, Box, Heading, Stack, useBreakpointValue, useTheme } from 'native-base';
import AsNavigationItem from '../components/AsNavigationItem';
import LangNavigation from '../components/LangNavigation';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import Tabs from '../components/Tabs';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const tabs = ['handbook', 'online-training'];

const KnowledgeCenter = () => {
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
    const currentTabIndex = tabs.indexOf(currentTabFromRoute || 'handbook');
    return (
        <AsNavigationItem path="knowledge-helper">
            <WithNavigation
                showBack={isMobile}
                previousFallbackRoute="/start"
                headerTitle={t('forStudents.title')}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <LangNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                <Box maxWidth={containerWidth} width="100%" marginX="auto" pt={6}>
                    <Box maxWidth={contentContainerWidth} paddingBottom={space['1.5']} paddingX={space['1.5']}>
                        <Heading paddingBottom={1.5}>{t('forStudents.title')}</Heading>
                        <Text>{t('forStudents.description')}</Text>
                    </Box>
                </Box>
                <Box width="100%" maxWidth={containerWidth} marginX="auto" flex={1}>
                    <Tabs
                        removeSpace
                        tabInset={0}
                        currentTabIndex={currentTabIndex !== -1 ? currentTabIndex : 0}
                        onPressTab={(tab) => navigate(`${tab.id}`)}
                        tabs={[
                            {
                                id: 'handbook',
                                title: t('forStudents.tabs.handbook'),
                                content: <Outlet />,
                            },
                            {
                                id: 'online-training',
                                title: t('forStudents.tabs.onlineTraining'),
                                content: (
                                    <Box flex={1} px={4}>
                                        <Outlet />
                                    </Box>
                                ),
                            },
                        ]}
                    />
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default KnowledgeCenter;
