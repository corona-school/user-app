import { useState } from 'react';
import { useTheme, Popover, VStack, Heading } from 'native-base';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EditDataRow from '../widgets/EditDataRow';
import useApollo from '../hooks/useApollo';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import DeactivateAccountModal from '../modals/DeactivateAccountModal';

const SettingsPopover: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { logout } = useApollo();
    const { trackEvent } = useMatomo();

    const [showDeactivate, setShowDeactivate] = useState<boolean>(false);

    return (
        <Popover.Content>
            <Popover.Arrow />
            <Popover.Header>
                <Heading fontSize="lg">{t('settings.header')}</Heading>
            </Popover.Header>
            <Popover.Body>
                <VStack space={space['0.5']}>
                    <Heading fontSize="lg">{t('settings.general.title')}</Heading>
                    <EditDataRow label={t('settings.general.profile')} onPress={() => navigate('/profile')} hideArrowIcon />
                    <EditDataRow label={t('settings.general.notifications')} onPress={() => navigate('/notifications')} hideArrowIcon />
                    <Heading fontSize="lg" mt="2">
                        {t('settings.account.title')}
                    </Heading>
                    <EditDataRow label={t('settings.account.changeEmail')} onPress={() => navigate('/new-email')} hideArrowIcon />
                    <EditDataRow label={t('settings.account.changePassword')} onPress={() => navigate('/new-password')} hideArrowIcon />
                    <EditDataRow label={t('settings.account.deactivateAccount')} onPress={() => setShowDeactivate(true)} hideArrowIcon />
                    <EditDataRow
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
                        hideArrowIcon
                    />
                    <Heading fontSize="lg" mt="2">
                        {t('settings.legal.title')}
                    </Heading>
                    <EditDataRow label={t('settings.legal.imprint')} onPress={() => navigate('/impressum')} hideArrowIcon />
                    <EditDataRow label={t('settings.legal.datapolicy')} onPress={() => navigate('/datenschutz')} hideArrowIcon />
                </VStack>
            </Popover.Body>
            <DeactivateAccountModal isOpen={showDeactivate} onCloseModal={() => setShowDeactivate(false)} />
        </Popover.Content>
    );
};

export default SettingsPopover;
