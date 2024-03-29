import { Box, Text, useBreakpointValue } from 'native-base';
import PreferenceItem from './PreferenceItem';
import { FC, useContext } from 'react';
import { NotificationCategories } from '../../../helper/notification-preferences';
import { NotificationPreferencesContext } from '../../../pages/notification/NotficationControlPanel';
import { ToggleAll } from './ToggleAll';

type Props = {
    title: string;
    notificationCategories: NotificationCategories;
    enableToggleAll?: boolean;
};

export const Preferences: FC<Props> = ({ title, notificationCategories, enableToggleAll }) => {
    const { userPreferences, updateUserPreference, channels } = useContext(NotificationPreferencesContext);

    const marginLeft = useBreakpointValue({
        base: 0,
        lg: 5,
    });

    const marginBottom = useBreakpointValue({
        base: 5,
        lg: 3,
    });

    const getCheckboxValue = (category: string, channel: string) =>
        userPreferences[category] && userPreferences[category].hasOwnProperty(channel) ? userPreferences[category][channel] : false;

    return (
        <>
            <Box ml={marginLeft}>
                <Text mb={marginBottom}>{title}</Text>
                <Box>
                    {Object.keys(notificationCategories).map((category: string) =>
                        channels.map((channel: string) => (
                            <PreferenceItem
                                category={category}
                                notificationTypeDetails={notificationCategories[category]}
                                value={getCheckboxValue(category, channel)}
                                onUpdate={(value: boolean) => updateUserPreference(category, channel, value)}
                            />
                        ))
                    )}
                    {enableToggleAll && <ToggleAll notificationCategories={notificationCategories} />}
                </Box>
            </Box>
        </>
    );
};
