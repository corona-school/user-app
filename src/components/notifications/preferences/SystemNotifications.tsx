import { Box, Flex, Switch, Text, Spinner, IconButton, Tooltip, useBreakpointValue } from 'native-base';
import { Preferences } from './Preferences';
import { useTranslation } from 'react-i18next';
import { systemNotificationCategories } from '../../../helper/notification-preferences';
import InformationBadge from './InformationBadge';
import { useContext, useMemo, useState } from 'react';
import InformationModal from '../../../modals/InformationModal';
import { WEBPUSH_ACTIVE } from '../../../config';
import { WebPushContext } from '../../../context/WebPushProvider';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export const SystemNotifications = () => {
    const [, setPushEnabled] = useLocalStorage({ key: 'lern-fair-web-push-enabled', initialValue: false });
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const { subscribe, unsubscribe, status } = useContext(WebPushContext);
    const { t } = useTranslation();
    const isMobileOrTable = useBreakpointValue({
        base: true,
        lg: false,
    });

    const handleOnChange = async (enableNotifications: boolean) => {
        setPushEnabled(enableNotifications);
        if (enableNotifications) {
            await subscribe();
        } else {
            await unsubscribe();
        }
    };

    const channels = useMemo(() => {
        const defaultChannels = [{ id: 'email', label: t('notification.controlPanel.preference.channel.email') }];
        if (WEBPUSH_ACTIVE) {
            defaultChannels.push({
                id: 'push',
                label: t('notification.controlPanel.preference.channel.push'),
            });
        }
        return defaultChannels;
    }, [t]);

    return (
        <Box>
            {WEBPUSH_ACTIVE && (
                <Flex direction="row" bg={'primary.100'} mx={2} my={1} py={3} px={4} borderRadius="sm" justifyContent="space-between">
                    <Flex direction="row" alignItems="center" flexWrap="wrap">
                        <Text fontWeight="bold" color={'primary.900'} fontSize="sm">
                            {t(`notification.controlPanel.preference.pushNotifications`)}
                        </Text>
                        <>
                            {isMobileOrTable ? (
                                <IconButton onPress={() => setIsInfoModalOpen(true)} icon={<InformationBadge ml={0} bg="primary.900" />} />
                            ) : (
                                <Tooltip
                                    maxW={250}
                                    label={t('notification.controlPanel.preference.pushNotificationTooltip')}
                                    bg={'primary.900'}
                                    _text={{ textAlign: 'center' }}
                                    p={3}
                                    hasArrow
                                    children={
                                        <Box ml={2}>
                                            <InformationBadge ml={0} bg="primary.900" />
                                        </Box>
                                    }
                                ></Tooltip>
                            )}
                        </>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                        {status === 'loading' && <Spinner mr={1} />}
                        <Switch isChecked={status === 'subscribed'} onValueChange={handleOnChange} />
                    </Flex>
                </Flex>
            )}
            <Preferences
                title={t('notification.controlPanel.tabs.system.description')}
                notificationCategories={systemNotificationCategories}
                channels={channels}
            />
            <InformationModal
                title={t('notification.controlPanel.preference.pushNotifications')}
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            >
                <Text>{t('notification.controlPanel.preference.pushNotificationTooltip')}</Text>
            </InformationModal>
        </Box>
    );
};
