import { HStack, Button, IconButton, Text } from 'native-base';
import useInstallation from '../hooks/useInstallation';
import IconClose from '../assets/icons/ic_close.svg';
import IconShare from '../assets/icons/icon_share.svg';
import IconAdd from '../assets/icons/icon_add_square.svg';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Trans, useTranslation } from 'react-i18next';

export const NativeInstallAppBanner = () => {
    const { shouldPromote, promote, promotionType } = useInstallation();
    const { t } = useTranslation();
    const [show, setShow] = useLocalStorage({ key: 'recommend-lern-fair-installation', initialValue: true });
    if (!shouldPromote || promotionType !== 'native' || !show) return null;

    if (promotionType === 'native') {
        return (
            <HStack space={1.5} px={2} height="100px" width="full" background="#fbefc6" display="flex" flexDirection="row" alignItems="center">
                <IconButton icon={<IconClose />} size="sm" onPress={() => setShow(false)} />
                <Text fontSize="sm">
                    <strong style={{ display: 'block' }}>{t('installation.native.installTitle')}</strong>
                    <span>{t('installation.native.installDescription')}</span>
                </Text>
                <Button width="110px" size="xs" onPress={promote}>
                    {t('installation.native.installButton')}
                </Button>
            </HStack>
        );
    }
    return null;
};

interface IOSInstallAppBannerProps {
    variant: 'iPad' | 'iPhone';
}

export const IOSInstallAppBanner = ({ variant }: IOSInstallAppBannerProps) => {
    const { shouldPromote, promotionType } = useInstallation();
    const [show, setShow] = useLocalStorage({ key: 'recommend-lern-fair-installation', initialValue: true });
    if (!shouldPromote || !show) return null;
    if (variant !== promotionType) return null;

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
                <Trans i18nKey="installation.iOS.installDescription" components={[<IconShare />, <IconAdd />]}></Trans>
            </Text>
            <IconButton icon={<IconClose />} size="sm" onPress={() => setShow(false)} style={isIpad ? {} : { position: 'absolute', top: 0, right: 0 }} />
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
