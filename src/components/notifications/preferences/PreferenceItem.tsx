import { VStack, Text, Checkbox, Flex, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { NotificationCategoryDetails } from '../../../helper/notification-preferences';
import { getNotificationCategoriesData } from '../../../helper/notification-helper';
import { PreferencesType } from '../../../types/lernfair/NotificationPreferences';

type PreferenceItemProps = {
    category: string;
    channels: string[];
    notificationTypeDetails: NotificationCategoryDetails;
    value: PreferencesType;
    onUpdate: (value: PreferencesType) => void;
};

const PreferenceItem = ({ category, channels, notificationTypeDetails, value, onUpdate }: PreferenceItemProps) => {
    const { t } = useTranslation();

    const isMobile = useBreakpointValue({
        base: true,
        md: false,
    });

    const Icon = notificationTypeDetails?.icon ? notificationTypeDetails?.icon : () => null;
    const notificationPreferenceInfos = getNotificationCategoriesData(category).allPrefs[category];

    return (
        <Flex py={3} direction="row" justifyContent="space-between">
            <Flex w={isMobile ? '60%' : '80%'}>
                <Flex direction="row">
                    {notificationTypeDetails?.icon && (
                        <VStack mr={2}>
                            <Icon />
                        </VStack>
                    )}
                    <Text fontWeight="bold" fontSize="md" mr="3" ellipsizeMode="tail" numberOfLines={2}>
                        {t(notificationTypeDetails.title)}
                    </Text>
                </Flex>
                <Text fontSize="sm">{t(notificationPreferenceInfos.modal.body)}</Text>
            </Flex>
            {channels.map((channel) => (
                <Flex direction="row" justifyContent="center" w={isMobile ? '20%' : '10%'}>
                    <Checkbox
                        borderColor={'primary.500'}
                        borderWidth={1}
                        value={notificationTypeDetails.title}
                        isChecked={value[channel]}
                        onChange={() => onUpdate({ ...value, [channel]: !value[channel] })}
                    />
                </Flex>
            ))}
        </Flex>
    );
};

export default PreferenceItem;
