import { Box, useBreakpointValue, Stack, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { NotificationCategories } from '../../../helper/notification-preferences';
import { FC, useContext, useMemo } from 'react';
import { NotificationPreferencesContext } from '../../../pages/notification/NotficationControlPanel';
import { getAllPreferencesInCategorySetToValue } from '../../../helper/notification-helper';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import DisableableButton from '../../DisablebleButton';

type PrefProps = {
    notificationCategories: NotificationCategories;
};

export const ToggleAll: FC<PrefProps> = ({ notificationCategories }) => {
    const { userPreferences, channels, updateUserPreferences } = useContext(NotificationPreferencesContext);
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const toast = useToast();

    const buttonWidth = useBreakpointValue({
        base: '100%',
        md: '35%',
        lg: '30%',
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

    const enableAll = async () => {
        await updateUserPreferences(getAllPreferencesInCategorySetToValue(userPreferences, true, notificationCategories, channels));
        toast.show({ description: t('notification.controlPanel.preference.allNewsletterEnabled') });
    };

    const disableAll = async () => {
        await updateUserPreferences(getAllPreferencesInCategorySetToValue(userPreferences, false, notificationCategories, channels));
        toast.show({ description: t('notification.controlPanel.preference.allNewsletterDisabled') });
    };

    return (
        userPreferences &&
        channels &&
        notificationCategories && (
            <Box borderBottomWidth={1} borderBottomColor={'gray.100'} py={3} width="100%">
                <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3}>
                    <DisableableButton
                        isDisabled={allEnabled}
                        reasonDisabled={t('notification.controlPanel.preference.enableAllTooltip')}
                        onPress={enableAll}
                        width={buttonWidth}
                    >
                        {t('notification.controlPanel.preference.enableAll')}
                    </DisableableButton>
                    <DisableableButton
                        isDisabled={allDisabled}
                        reasonDisabled={t('notification.controlPanel.preference.disableAllTooltip')}
                        onPress={disableAll}
                        _text={{ padding: '3px 5px' }}
                        variant="outline"
                        width={buttonWidth}
                    >
                        {t('notification.controlPanel.preference.disableAll')}
                    </DisableableButton>
                </Stack>
            </Box>
        )
    );
};
