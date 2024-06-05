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
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { GAMIFICATION_ACTIVE, LANGUAGE_SWITCHER_ACTIVE, WEBPUSH_ACTIVE } from '../config';

const Settings: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { logout, user } = useApollo();
    const tabspace = 3;
    const { trackPageView, trackEvent } = useMatomo();
    const userType = useUserType();

    const [showDeactivate, setShowDeactivate] = useState(false);
    const [showSwitchLanguage, setShowSwitchLanguage] = useState(false);

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

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    return (
        <>
            <WithNavigation
                headerTitle={t('settings.header')}
                hideMenu
                showBack
                previousFallbackRoute="/start"
                headerLeft={userType !== 'screener' && <NotificationAlert />}
            >
                <VStack paddingBottom={7} paddingX={space['1.5']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                    <HStack space={space['1']} alignItems="center">
                        <Heading>{user?.firstname}</Heading>
                    </HStack>
                    {LANGUAGE_SWITCHER_ACTIVE && (
                        <Column paddingY={space['1']} mb={tabspace}>
                            <ListItem label="Sprache wechseln / Switch language" onPress={() => setShowSwitchLanguage(true)} />
                        </Column>
                    )}
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
                            {userType === 'student' && isMobile && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.forStudents')} onPress={() => navigate('/for-students')} />
                                </Column>
                            )}
                            {userType === 'pupil' && isMobile && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.forPupils')} onPress={() => navigate('/for-pupils')} />
                                </Column>
                            )}
                            {WEBPUSH_ACTIVE && (
                                <Column mb={tabspace}>
                                    <ListItem label={'Push'} onPress={() => navigate('/push')} />
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
            <SwitchLanguageModal isOpen={showSwitchLanguage} onCloseModal={() => setShowSwitchLanguage(false)} />
        </>
    );
};
export default Settings;
