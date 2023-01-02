import { Heading, Row, useBreakpointValue, useTheme, View, VStack } from 'native-base';
import Tabs from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import { useTranslation } from 'react-i18next';
import { SystemNotifications } from '../../components/notifications/preferences/SystemNotifications';
import { MarketingNotifications } from '../../components/notifications/preferences/MarketingNotifications';
import { useUserPreferences } from '../../hooks/useNotificationPreferences';
import { createContext } from 'react';

const channels = ['email'];

type NotificationPreferencesContextType = ReturnType<typeof useUserPreferences> & { channels: typeof channels };
export const NotificationPreferencesContext = createContext<NotificationPreferencesContextType>({} as NotificationPreferencesContextType);

const NotficationControlPanel = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const userPreferences = useUserPreferences();

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const width = useBreakpointValue({
        base: '90%',
        lg: '90%',
    });

    return (
        <NotificationPreferencesContext.Provider value={{ ...userPreferences, channels }}>
            <WithNavigation showBack headerTitle={t('notification.controlPanel.title')}>
                <View py={5} width={width}>
                    {!isMobile && (
                        <Row marginBottom={space['2']} ml={3}>
                            <Heading>{t('notification.controlPanel.title')}</Heading>
                        </Row>
                    )}
                    <VStack ml={3}>
                        <Tabs
                            tabs={[
                                {
                                    title: t('notification.controlPanel.tabs.system.title'),
                                    content: <SystemNotifications />,
                                },
                                {
                                    title: t('notification.controlPanel.tabs.newsletter.title'),
                                    content: <MarketingNotifications />,
                                },
                            ]}
                        />
                    </VStack>
                </View>
            </WithNavigation>
        </NotificationPreferencesContext.Provider>
    );
};

export default NotficationControlPanel;
