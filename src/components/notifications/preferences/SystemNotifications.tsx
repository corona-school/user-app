import { Box, Flex, Switch, Text, Spinner, IconButton, Tooltip, InfoIcon, useBreakpointValue } from 'native-base';
import { Preferences } from './Preferences';
import { useTranslation } from 'react-i18next';
import { systemNotificationCategories } from '../../../helper/notification-preferences';
import { useWebPush } from '../../../lib/WebPush';
import InformationBadge from './InformationBadge';
import { useState } from 'react';
import InformationModal from '../../../modals/InformationModal';

export const SystemNotifications = () => {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const { subscribe, unsubscribe, status } = useWebPush();
    const { t } = useTranslation();
    const isMobileOrTable = useBreakpointValue({
        base: true,
        lg: false,
    });

    const handleOnChange = (enableNotifications: boolean) => {
        if (enableNotifications) {
            subscribe();
        } else {
            unsubscribe();
        }
    };

    return (
        <Box>
            <Flex direction="row" bg="primary.100" mx={2} my={1} py={3} px={4} borderRadius="sm" justifyContent="space-between">
                <Flex direction="row" alignItems="center">
                    <Text fontWeight="bold">{t('notification.controlPanel.preference.pushNotifications')}</Text>
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
                </Flex>
                <Flex direction="row" alignItems="center">
                    {status === 'loading' && <Spinner mr={1} />}
                    <Switch isChecked={status === 'subscribed'} onValueChange={handleOnChange} />
                </Flex>
            </Flex>
            <Preferences
                title={t('notification.controlPanel.tabs.system.description')}
                notificationCategories={systemNotificationCategories}
                channels={[
                    { id: 'email', label: t('notification.controlPanel.preference.channel.email') },
                    { id: 'push', label: t('notification.controlPanel.preference.channel.push') },
                ]}
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
