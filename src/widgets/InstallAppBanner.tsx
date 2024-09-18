import { HStack, Button, IconButton, Text } from 'native-base';
import IconClose from '../assets/icons/ic_close.svg';
import IconShare from '../assets/icons/icon_share.svg';
import IconAdd from '../assets/icons/icon_add_square.svg';
import { Trans, useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { InstallationContext } from '../context/InstallationProvider';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { BaseModalProps, Modal, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';

const InstallAppBanner = () => {
    const { install, stopPromoting, shouldPromote } = useContext(InstallationContext);
    const { trackEvent } = useMatomo();
    const { t } = useTranslation();

    useEffect(() => {
        if (shouldPromote) {
            trackEvent({
                category: 'pwa',
                action: 'install-banner-is-shown',
                name: '',
            });
        }
    }, [shouldPromote]);

    const handleOnInstallClick = async () => {
        trackEvent({
            category: 'pwa',
            action: 'install-button-is-clicked',
            name: 'install-banner',
        });
        await install();
    };

    const handleOnCloseClick = () => {
        trackEvent({
            category: 'pwa',
            action: 'install-banner-is-closed',
            name: '',
        });
        stopPromoting();
    };

    if (!shouldPromote) return null;

    return (
        <HStack space={1.5} px={2} height="100px" width="full" background="#fbefc6" display="flex" flexDirection="row" alignItems="center">
            <IconButton icon={<IconClose />} size="sm" onPress={handleOnCloseClick} />
            <Text fontSize="sm">
                <strong style={{ display: 'block' }}>{t('installation.installTitle')}</strong>
                <span>{t('installation.installDescription')}</span>
            </Text>
            <Button width="110px" size="xs" onPress={handleOnInstallClick}>
                {t('installation.installButton')}
            </Button>
        </HStack>
    );
};

export const InstallInstructionsModal = ({ isOpen, onOpenChange }: BaseModalProps) => {
    const { t } = useTranslation();
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="w-[90%] lg:w-full">
            <ModalHeader>
                <ModalTitle>{t('installation.iOSInstallInstructions.title')}</ModalTitle>
            </ModalHeader>
            <div>
                <Typography>
                    1. <Trans i18nKey="installation.iOSInstallInstructions.steps.first" components={[<IconShare className="inline" />]}></Trans>
                </Typography>
                <Typography>
                    2. <Trans i18nKey="installation.iOSInstallInstructions.steps.second" components={[<IconAdd className="inline" />]}></Trans>
                </Typography>
            </div>
        </Modal>
    );
};

export default InstallAppBanner;
