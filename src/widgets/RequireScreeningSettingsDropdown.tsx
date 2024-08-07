import { useState } from 'react';
import { Divider, Menu, Pressable } from 'native-base';
import SettingsIcon from '../assets/icons/icon_settings.svg';
import { useTranslation } from 'react-i18next';
import NotificationPreferencesModal from '../modals/NotificationPreferencesModal';
import DeactivateAccountModal from '../modals/DeactivateAccountModal';
import { ContactSupportModal } from '../modals/ContactSupportModal';
import useLogout from '../hooks/useLogout';

const RequireScreeningSettingsDropdown = () => {
    const { t } = useTranslation();
    const [isNotificationPrefencesOpen, setIsNotificationPreferencesOpen] = useState(false);
    const [isDeactivateAccountOpen, setIsDeactivateAccountOpen] = useState(false);
    const [isContactSupportOpen, setIsContactSupportOpen] = useState(false);
    const logout = useLogout();
    return (
        <>
            <Menu
                closeOnSelect
                trigger={(triggerProps) => {
                    return (
                        <Pressable accessibilityLabel="Settings" {...triggerProps}>
                            <SettingsIcon />
                        </Pressable>
                    );
                }}
                placement="bottom left"
            >
                <Menu.Item onPress={() => setIsNotificationPreferencesOpen(true)}>{t('settings.general.notifications')}</Menu.Item>
                <Menu.Item onPress={() => setIsContactSupportOpen(true)}>{t('requireScreening.contactSupport')}</Menu.Item>
                <Divider />
                <Menu.Item onPress={() => setIsDeactivateAccountOpen(true)}>{t('settings.account.deactivateAccount')}</Menu.Item>
                <Menu.Item onPress={() => logout()}>{t('logout')}</Menu.Item>
            </Menu>
            <DeactivateAccountModal isOpen={isDeactivateAccountOpen} onCloseModal={() => setIsDeactivateAccountOpen(false)} />
            <NotificationPreferencesModal isOpen={isNotificationPrefencesOpen} onClose={() => setIsNotificationPreferencesOpen(false)} />
            <ContactSupportModal isOpen={isContactSupportOpen} onClose={() => setIsContactSupportOpen(false)} />
        </>
    );
};

export default RequireScreeningSettingsDropdown;
