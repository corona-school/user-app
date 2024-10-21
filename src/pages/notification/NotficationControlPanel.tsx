import { Column, Heading, Row, Stack, Text, useBreakpointValue, useTheme, useToast, View, VStack } from 'native-base';
import Tabs from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import { useTranslation } from 'react-i18next';
import { useUserPreferences } from '../../hooks/useNotificationPreferences';
import { createContext, useEffect } from 'react';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import { useQuery } from '@apollo/client';
import { gql } from '../../gql';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import { Outlet, useNavigate, useMatch, useSearchParams } from 'react-router-dom';
import { getAllPreferencesInCategorySetToValue } from '../../helper/notification-helper';
import { marketingNotificationCategories } from '../../helper/notification-preferences';
import { useBreadcrumbItems } from '@/hooks/useBreadcrumbItems';
import { Breadcrumb } from '@/components/Breadcrumb';

const channels = ['email', 'push'];

type NotificationPreferencesContextType = ReturnType<typeof useUserPreferences> & { channels: typeof channels };
export const NotificationPreferencesContext = createContext<NotificationPreferencesContextType>({} as NotificationPreferencesContextType);

const NotificationControlPanel = () => {
    const { space } = useTheme();
    const toast = useToast();
    const { t } = useTranslation();
    const breadcrumb = useBreadcrumbItems();
    const { userPreferences, updateUserPreferences, ...rest } = useUserPreferences();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isNewsletter = useMatch({ path: 'notifications/newsletter' });
    const shouldUnsubscribe = searchParams.has('unsubscribe');

    useEffect(() => {
        const hasPreferences = Object.keys(userPreferences).length > 0;
        if (shouldUnsubscribe && isNewsletter && hasPreferences) {
            searchParams.delete('unsubscribe');
            updateUserPreferences(getAllPreferencesInCategorySetToValue(userPreferences, false, marketingNotificationCategories, channels)).then(() => {
                toast.show({
                    description: t('notification.controlPanel.preference.allNewsletterDisabled'),
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldUnsubscribe, userPreferences]);

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

    const isMobileSM = useBreakpointValue({
        base: true,
        sm: false,
    });

    return (
        <NotificationPreferencesContext.Provider value={{ userPreferences, updateUserPreferences, ...rest, channels }}>
            <WithNavigation
                hideMenu={isMobileSM}
                previousFallbackRoute="/settings"
                headerTitle={t('notification.controlPanel.title')}
                headerLeft={
                    !isMobileSM && (
                        <Stack alignItems="center" direction="row">
                            <SwitchLanguageButton />
                            <NotificationAlert />
                        </Stack>
                    )
                }
            >
                <Breadcrumb
                    className="mx-4"
                    items={[breadcrumb.SETTINGS, isNewsletter ? breadcrumb.NEWSLETTER_NOTIFICATIONS : breadcrumb.SYSTEM_NOTIFICATIONS]}
                />
                <View py={5}>
                    {!isMobile && (
                        <Column space={space['1']} marginBottom={space['2']} ml={3}>
                            <Heading>{t('notification.controlPanel.title')}</Heading>
                            <Row>
                                <Text bold>{t('notification.controlPanel.yourMail')}</Text>
                                <Text> {data?.me?.email}</Text>
                            </Row>
                        </Column>
                    )}
                    <VStack flex={1}>
                        <Tabs
                            removeSpace
                            currentTabIndex={isNewsletter ? 1 : 0}
                            onPressTab={(tab) => navigate(`${tab.id}`)}
                            tabs={[
                                {
                                    id: 'system',
                                    title: t('notification.controlPanel.tabs.system.title'),
                                    content: <Outlet />,
                                },
                                {
                                    id: 'newsletter',
                                    title: t('notification.controlPanel.tabs.newsletter.title'),
                                    content: <Outlet />,
                                },
                            ]}
                        />
                    </VStack>
                </View>
            </WithNavigation>
        </NotificationPreferencesContext.Provider>
    );
};

export default NotificationControlPanel;
