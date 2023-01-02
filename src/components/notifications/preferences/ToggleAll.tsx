import { Button, Box, useBreakpointValue, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { NotificationCategories } from '../../../helper/notification-preferences';
import { FC, useContext, useMemo } from 'react';
import { NotificationPreferencesContext } from '../../../pages/notification/NotficationControlPanel';
import { getAllPreferencesInCategorySetToValue } from '../../../helper/notification-helper';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';

type PrefProps = {
    notificationCategories: NotificationCategories;
};

export const ToggleAll: FC<PrefProps> = ({ notificationCategories }) => {
    const { userPreferences, channels, updateUserPreferences } = useContext(NotificationPreferencesContext);
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();

    const width = useBreakpointValue({
        base: 340,
        lg: '100%',
    });

    // use isEnabled=true to check if all preferences are enabled and isEnabled=false to check if all preferences are disabled
    const isAllEnabledOrDisabled = (isEnabled: boolean = true) => {
        if (!userPreferences || !notificationCategories || !channels) {
            return false;
        }
        return Object.keys(notificationCategories).every((category: string) =>
            channels.every((channel: string) => {
                if (!userPreferences.hasOwnProperty(category) || !userPreferences[category].hasOwnProperty(channel)) return true;

                return isEnabled ? userPreferences[category][channel] : !userPreferences[category][channel];
            })
        );
    };

    const isAllEnabled = () => isAllEnabledOrDisabled(true);
    const isAllDisabled = () => isAllEnabledOrDisabled(false);

    const allEnabled = useMemo(isAllEnabled, [userPreferences, notificationCategories]);
    const allDisabled = useMemo(isAllDisabled, [userPreferences, notificationCategories]);

    const enableAll = () => {
        updateUserPreferences(getAllPreferencesInCategorySetToValue(userPreferences, true, notificationCategories, channels));
    };

    const disableAll = () => {
        updateUserPreferences(getAllPreferencesInCategorySetToValue(userPreferences, false, notificationCategories, channels));
    };

    return (
        userPreferences &&
        channels &&
        notificationCategories && (
            <Box borderBottomWidth={1} borderBottomColor={'gray.100'} py={3} width={width}>
                <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={1}>
                    <Button onPress={enableAll} disabled={allEnabled}>
                        {t('notification.controlPanel.preference.enableAll')}
                    </Button>
                    <Button onPress={disableAll} variant="ghost" disabled={allDisabled}>
                        {t('notification.controlPanel.preference.disableAll')}
                    </Button>
                </Stack>
            </Box>
        )
    );
};
