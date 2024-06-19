import { HStack, Button, IconButton, Text } from 'native-base';
import IconClose from '../assets/icons/ic_close.svg';
import IconShare from '../assets/icons/icon_share.svg';
import IconAdd from '../assets/icons/icon_add_square.svg';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Trans, useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { InstallationContext, PromotionType } from '../context/InstallationProvider';

interface InstallAppBannerProps {
    onInstall?: (promotionType: PromotionType) => void;
}

const InstallAppBanner = ({ onInstall }: InstallAppBannerProps) => {
    const { shouldPromote, install, promotionType } = useContext(InstallationContext);
    const { t } = useTranslation();
    const [show, setShow] = useLocalStorage({ key: 'recommend-lern-fair-installation', initialValue: true });
    if (!shouldPromote || !show) return null;

    const handleOnInstallClick = async () => {
        if (promotionType === 'native') {
            await install();
            return;
        }
        onInstall && onInstall(promotionType);
    };

    return (
        <HStack space={1.5} px={2} height="100px" width="full" background="#fbefc6" display="flex" flexDirection="row" alignItems="center">
            <IconButton icon={<IconClose />} size="sm" onPress={() => setShow(false)} />
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
            pt={2}
            pb={4}
            width="full"
            background="#fbefc6"
            display="flex"
            flexDirection={isIpad ? 'row' : 'column'}
            alignItems="center"
            justifyContent="center"
            position="absolute"
            style={{ bottom: isIpad ? 'unset' : '15px', top: isIpad ? '15px' : 'unset' }}
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
