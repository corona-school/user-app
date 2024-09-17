import { HStack, Button, IconButton, Text } from 'native-base';
import IconClose from '../assets/icons/ic_close.svg';
import IconShare from '../assets/icons/icon_share.svg';
import IconAdd from '../assets/icons/icon_add_square.svg';
import { Trans, useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { InstallationContext } from '../context/InstallationProvider';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

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

interface IOSInstallAppInstructionsProps {
    variant: 'iPad' | 'iPhone';
    onClose: () => void;
}

export const IOSInstallAppInstructions = ({ variant, onClose }: IOSInstallAppInstructionsProps) => {
    const isIpad = variant === 'iPad';

    return (
        <HStack
            space={1}
            px={2}
            pt={isIpad ? 1 : 2}
            pb={isIpad ? 2 : 4}
            width="full"
            background="#fbefc6"
            display="flex"
            flexDirection={isIpad ? 'row' : 'column'}
            alignItems="center"
            justifyContent="center"
            position="absolute"
            style={{ bottom: isIpad ? 'unset' : '15px', top: isIpad ? '10px' : 'unset' }}
            zIndex="99999"
        >
            <Text fontSize="sm" textAlign="center" width="100%" display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" mt={isIpad ? 0 : 3}>
                <Trans i18nKey="installation.iOSInstallInstructions" components={[<IconShare />, <IconAdd />]}></Trans>
            </Text>
            <IconButton icon={<IconClose />} size="sm" onPress={onClose} style={isIpad ? {} : { position: 'absolute', top: 0, right: 0 }} />
            <div
                style={{
                    borderWidth: '10px',
                    borderStyle: 'solid',
                    borderColor: isIpad ? 'transparent transparent #fbefc6' : '#fbefc6 transparent transparent',
                    position: 'absolute',
                    bottom: isIpad ? 'unset' : -20,
                    top: isIpad ? -20 : 'unset',
                    right: isIpad ? '115px' : '50%',
                }}
            ></div>
        </HStack>
    );
};

export default InstallAppBanner;
