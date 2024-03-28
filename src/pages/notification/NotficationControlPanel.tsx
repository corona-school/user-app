import { Column, Heading, Row, Stack, Text, useBreakpointValue, useTheme, View, VStack } from 'native-base';
import NavigationTabs from '../../components/NavigationTabs';
import WithNavigation from '../../components/WithNavigation';
import { useTranslation } from 'react-i18next';
import { SystemNotifications } from '../../components/notifications/preferences/SystemNotifications';
import { MarketingNotifications } from '../../components/notifications/preferences/MarketingNotifications';
import { useUserPreferences } from '../../hooks/useNotificationPreferences';
import { createContext } from 'react';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import { useQuery } from '@apollo/client';
import { gql } from '../../gql/gql';
import HelpNavigation from '../../components/HelpNavigation';

const channels = ['email'];

type NotificationPreferencesContextType = ReturnType<typeof useUserPreferences> & { channels: typeof channels };
export const NotificationPreferencesContext = createContext<NotificationPreferencesContextType>({} as NotificationPreferencesContextType);

const NotficationControlPanel = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const userPreferences = useUserPreferences();

    const { data } = useQuery(
        gql(`
            query MeEmail {
                me {
                    firstname
                    email
                }
            }
        `)
    );

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
            <WithNavigation
                showBack
                headerTitle={t('notification.controlPanel.title')}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                <View py={5} width={width}>
                    {!isMobile && (
                        <Column space={space['1']} marginBottom={space['2']} ml={3}>
                            <Heading>{t('notification.controlPanel.title')}</Heading>
                            <Row>
                                <Text bold>{t('notification.controlPanel.yourMail')}</Text>
                                <Text> {data?.me?.email}</Text>
                            </Row>
                        </Column>
                    )}
                    <VStack ml={3}>
                        <NavigationTabs
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
