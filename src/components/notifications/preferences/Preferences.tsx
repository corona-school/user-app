import { Box, Flex, Text, useBreakpointValue } from 'native-base';
import PreferenceItem from './PreferenceItem';
import { FC, useContext } from 'react';
import { NotificationCategories, NotificationChannel } from '../../../helper/notification-preferences';
import { NotificationPreferencesContext } from '../../../pages/notification/NotficationControlPanel';
import { ToggleAll } from './ToggleAll';
import { useTranslation } from 'react-i18next';
import { PreferencesType } from '../../../types/lernfair/NotificationPreferences';
import { toast } from 'sonner';

type Props = {
    title: string;
    notificationCategories: NotificationCategories;
    enableToggleAll?: boolean;
    channels: NotificationChannel[];
};

export const Preferences: FC<Props> = ({ title, notificationCategories, enableToggleAll, channels }) => {
    const { userPreferences, updateUserPreference } = useContext(NotificationPreferencesContext);
    const { t } = useTranslation();
    const marginBottom = useBreakpointValue({
        base: 5,
        lg: 3,
    });

    const isMobile = useBreakpointValue({
        base: true,
        md: false,
    });

    const getCheckboxValue = (category: string) => (userPreferences[category] ? userPreferences[category] : {});

    const handleOnUpdatePreference = (category: string, value: PreferencesType) => {
        updateUserPreference(category, value).then(() => {
            toast.success(t('notification.controlPanel.preference.preferencesUpdated'));
        });
    };

    return (
        <Box pt={3} px={3}>
            <Text mb={marginBottom}>{title}</Text>
            <Box>
                <Flex direction="row" justifyContent="space-between">
                    <Flex w={isMobile ? '60%' : '80%'} />
                    {channels.map((channel) => (
                        <Flex key={channel.id} direction="row" justifyContent="center" w={isMobile ? '20%' : '10%'}>
                            <Text fontSize="sm" fontWeight="bold" textAlign="center">
                                {channel.label}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
                {Object.keys(notificationCategories).map((category: string) => (
                    <PreferenceItem
                        channels={channels.map((e) => e.id)}
                        category={category}
                        notificationTypeDetails={notificationCategories[category]}
                        value={getCheckboxValue(category)}
                        onUpdate={(preference) => handleOnUpdatePreference(category, preference)}
                    />
                ))}
                {enableToggleAll && <ToggleAll notificationCategories={notificationCategories} />}
            </Box>
        </Box>
    );
};
