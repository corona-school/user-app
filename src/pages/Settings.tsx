import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Heading, useTheme, VStack, Column, HStack, useBreakpointValue, CloseIcon, Button } from 'native-base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import WithNavigation from '../components/WithNavigation';
import useApollo, { useUserType } from '../hooks/useApollo';
import DeactivateAccountModal from '../modals/DeactivateAccountModal';
import ListItem from '../widgets/ListItem';
import ProfileSettingRow from '../widgets/ProfileSettingRow';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { GAMIFICATION_ACTIVE } from '../config';

const Settings: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { logout, user } = useApollo();
    const tabspace = 3;
    const { trackPageView, trackEvent } = useMatomo();
    const userType = useUserType();

    const [showDeactivate, setShowDeactivate] = useState<boolean>(false);

    useEffect(() => {
        trackPageView({
            documentTitle: 'Einstellungen',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    return (
        <>
            <WithNavigation
                headerTitle={t('settings.header')}
                hideMenu
                headerRight={
                    <Button variant="ghost" onPress={() => navigate(-1)}>
                        <CloseIcon color="lightText" />
                    </Button>
                }
                headerLeft={userType !== 'screener' && <NotificationAlert />}
            >
                <VStack paddingBottom={7} paddingX={space['1.5']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                    <HStack space={space['1']} alignItems="center">
                        <Heading>{user?.firstname}</Heading>
                    </HStack>
                </VStack>
                <VStack paddingX={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                    {userType !== 'screener' && (
                        <ProfileSettingRow title={t('settings.general.title')} isSpace={false}>
                            <Column mb={tabspace}>
                                <ListItem label={t('settings.general.profile')} onPress={() => navigate('/profile')} />
                            </Column>
                            <Column mb={tabspace}>
                                <ListItem label={t('settings.general.notifications')} onPress={() => navigate('/notifications')} />
                            </Column>
                            {GAMIFICATION_ACTIVE && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.progress')} onPress={() => navigate('/progress')} />
                                </Column>
                            )}
                        </ProfileSettingRow>
                    )}
                    <ProfileSettingRow title={t('settings.account.title')} isSpace={false}>
                        <Column mb={tabspace}>
                            <ListItem label={t('settings.account.changeEmail')} onPress={() => navigate('/new-email')} />
                        </Column>
                        <Column mb={tabspace}>
                            <ListItem label={t('settings.account.changePassword')} onPress={() => navigate('/new-password')} />
                        </Column>

                        <Column mb={tabspace}>
                            <ListItem label={t('settings.account.deactivateAccount')} onPress={() => setShowDeactivate(true)} />
                        </Column>
                        <Column mb={tabspace}>
                            <ListItem
                                label={t('settings.account.logout')}
                                onPress={() => {
                                    trackEvent({
                                        category: 'profil',
                                        action: 'click-event',
                                        name: 'Abmelden im Account',
                                        documentTitle: 'Logout',
                                    });
                                    logout();
                                }}
                            />
                        </Column>
                    </ProfileSettingRow>
                    <ProfileSettingRow title={t('settings.legal.title')} isSpace={false}>
                        <Column mb={tabspace}>
                            <ListItem label={t('settings.legal.imprint')} onPress={() => navigate('/impressum')} />
                        </Column>
                        <Column mb={tabspace}>
                            <ListItem label={t('settings.legal.datapolicy')} onPress={() => navigate('/datenschutz')} />
                        </Column>
                    </ProfileSettingRow>
                </VStack>
            </WithNavigation>
            <DeactivateAccountModal isOpen={showDeactivate} onCloseModal={() => setShowDeactivate(false)} />
        </>
    );
};
export default Settings;
