import { Box, useBreakpointValue, Stack, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { NotificationCategories } from '../../../helper/notification-preferences';
import { FC, useContext, useMemo } from 'react';
import { NotificationPreferencesContext } from '../../../pages/notification/NotficationControlPanel';
import { getAllPreferencesInCategorySetToValue } from '../../../helper/notification-helper';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import Button from '@components/atoms/Button';
import { Button as ChakraButton } from '@chakra-ui/react';

type PrefProps = {
    notificationCategories: NotificationCategories;
};

export const ToggleAll: FC<PrefProps> = ({ notificationCategories }) => {
    const { userPreferences, channels, updateUserPreferences } = useContext(NotificationPreferencesContext);
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const toast = useToast();

    const boxWidth = useBreakpointValue({
        base: 340,
        lg: '100%',
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '25%',
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
            <Box borderBottomWidth={1} borderBottomColor={'gray.100'} py={3} width={boxWidth}>
                <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3}>
                    <Button
                        isDisabled={allEnabled}
                        reasonDisabled={t('notification.controlPanel.preference.enableAllTooltip')}
                        onClick={enableAll}
                        width={buttonWidth}
                        colorScheme="hero"
                    >
                        {t('notification.controlPanel.preference.enableAll')}
                    </Button>
                    <Button
                        isDisabled={allDisabled}
                        reasonDisabled={t('notification.controlPanel.preference.disableAllTooltip')}
                        onClick={disableAll}
                        width={buttonWidth}
                        variant="outline"
                    >
                        {t('notification.controlPanel.preference.disableAll')}
                    </Button>
                </Stack>
            </Box>
        )
    );
};
