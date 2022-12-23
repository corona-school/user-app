import { Box, HStack, VStack, Text, Spacer, Switch, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { NotificationCategories } from '../../../helper/notification-preferences';
import { useContext, useEffect } from 'react';
import { NotificationPreferencesContext } from '../../../pages/notification/NotficationControlPanel';

type PrefProps = {
    notificationCategories: NotificationCategories;
};

export const ToggleAll: React.FC<PrefProps> = ({ notificationCategories }) => {
    const { userPreferences, updateUserPreference, channels } = useContext(NotificationPreferencesContext);
    const { t } = useTranslation();

    const maxW = useBreakpointValue({
        base: 200,
        lg: '100%',
    });

    const width = useBreakpointValue({
        base: 340,
        lg: '100%',
    });

    const isAllDisabled = () => {
        Object.keys(notificationCategories).forEach((category: string) =>
            channels.every((channel: string) => console.log(category, channel, userPreferences[category][channel]))
        );
        return true;
    };
    /*
    const isAllDisabled = () =>
        Object.keys(notificationCategories).every((category: string) => channels.every((channel: string) => userPreferences[category][channel] === false));
*/
    useEffect(() => {
        console.log(userPreferences);
    }, [userPreferences, notificationCategories]);

    //const toggle

    return (
        userPreferences &&
        channels &&
        notificationCategories && (
            <Box borderBottomWidth={1} borderBottomColor={'gray.100'} py={3} width={width}>
                <HStack alignItems="center" space={1}>
                    <VStack maxW={maxW}>
                        <Text fontSize="md" mr="3" ellipsizeMode="tail" numberOfLines={2}>
                            {t('toggle.all')}
                        </Text>
                    </VStack>
                    <Spacer />
                    <VStack>
                        <Switch value={!isAllDisabled()} onToggle={() => null} />
                    </VStack>
                </HStack>
            </Box>
        )
    );
};
