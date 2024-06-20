import { Box, Flex, Text, useBreakpointValue, useToast } from 'native-base';
import PreferenceItem from './PreferenceItem';
import { FC, useContext } from 'react';
import { NotificationCategories } from '../../../helper/notification-preferences';
import { NotificationPreferencesContext } from '../../../pages/notification/NotficationControlPanel';
import { ToggleAll } from './ToggleAll';
import { useTranslation } from 'react-i18next';
import { PreferencesType } from '../../../types/lernfair/NotificationPreferences';

type Props = {
    title: string;
    notificationCategories: NotificationCategories;
    enableToggleAll?: boolean;
};

export const Preferences: FC<Props> = ({ title, notificationCategories, enableToggleAll }) => {
    const { userPreferences, updateUserPreference, channels } = useContext(NotificationPreferencesContext);
    const { t } = useTranslation();
    const toast = useToast();

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
            toast.show({ description: t('notification.controlPanel.preference.preferencesUpdated') });
        });
    };

    return (
        <Box pt={3} px={3}>
            <Text mb={marginBottom}>{title}</Text>
            <Box>
                <Flex direction="row" justifyContent="space-between">
                    <Flex w={isMobile ? '60%' : '80%'} />
                    <Flex direction="row" justifyContent="center" w={isMobile ? '20%' : '10%'}>
                        <Text fontSize="sm" fontWeight="bold">
                            Email
                        </Text>
                    </Flex>
                    <Flex direction="row" justifyContent="center" w={isMobile ? '20%' : '10%'}>
                        <Text fontSize="sm" fontWeight="bold" textAlign="center">
                            App-Mitteilung
                        </Text>
                    </Flex>
                </Flex>
                {Object.keys(notificationCategories).map((category: string) => (
                    <PreferenceItem
                        channels={channels}
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
