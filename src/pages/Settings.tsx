import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useTheme, VStack, Column, useBreakpointValue } from 'native-base';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import WithNavigation from '../components/WithNavigation';
import useApollo, { useUserType } from '../hooks/useApollo';
import DeactivateAccountModal from '../modals/DeactivateAccountModal';
import ListItem from '../widgets/ListItem';
import ProfileSettingRow from '../widgets/ProfileSettingRow';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { GAMIFICATION_ACTIVE, LANGUAGE_SWITCHER_ACTIVE } from '../config';
import { InstallationContext } from '../context/InstallationProvider';
import useLogout from '../hooks/useLogout';

const Settings: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useApollo();
    const logout = useLogout();
    const tabspace = 3;
    const { trackPageView, trackEvent } = useMatomo();
    const userType = useUserType();
    const { canInstall, install } = useContext(InstallationContext);

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

    const handleOnInstall = async () => {
        trackEvent({
            category: 'pwa',
            action: 'click-event',
            name: 'Lern-Fair installieren',
            documentTitle: 'Einstellungen',
        });
        await install();
    };

    return (
        <>
            <WithNavigation
                headerTitle={t('settings.header')}
                hideMenu
                showBack
                previousFallbackRoute="/start"
                headerLeft={userType !== 'screener' && <NotificationAlert />}
            >
                <VStack paddingX={space['1.5']} pt={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                    <>
                        <ProfileSettingRow title={user?.firstname!} isSpace={false}>
                            {userType !== 'screener' && (
                                <>
                                    <Column mb={tabspace}>
                                        <ListItem label={t('settings.general.profile')} onPress={() => navigate('/profile')} />
                                    </Column>
                                    <Column mb={tabspace}>
                                        <ListItem label={t('settings.general.notifications')} onPress={() => navigate('/notifications')} />
                                    </Column>
                                </>
                            )}
                        </ProfileSettingRow>
                        <ProfileSettingRow title={t('settings.general.title')} isSpace={false}>
                            {GAMIFICATION_ACTIVE && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.progress')} onPress={() => navigate('/progress')} />
                                </Column>
                            )}
                            {LANGUAGE_SWITCHER_ACTIVE && (
                                <Column mb={tabspace}>
                                    <ListItem label="Sprache wechseln / Switch language" onPress={() => setShowSwitchLanguage(true)} />
                                </Column>
                            )}
                            {canInstall && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('installation.installTitle')} onPress={handleOnInstall} />
                                </Column>
                            )}
                            {userType === 'student' && isMobile && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.forStudents')} onPress={() => navigate('/knowledge-helper')} />
                                </Column>
                            )}
                            {userType === 'pupil' && isMobile && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.forPupils')} onPress={() => navigate('/knowledge-pupil')} />
                                </Column>
                            )}
                        </ProfileSettingRow>
                    </>
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
