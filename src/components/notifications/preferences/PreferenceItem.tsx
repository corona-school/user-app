import { Box, HStack, VStack, Text, Spacer, Checkbox, useBreakpointValue, Flex } from 'native-base';
import { useTranslation } from 'react-i18next';
import { NotificationCategoryDetails } from '../../../helper/notification-preferences';
import { getNotificationCategoriesData } from '../../../helper/notification-helper';

type PreferenceItemProps = {
    category: string;
    notificationTypeDetails: NotificationCategoryDetails;
    value: boolean;
    onUpdate: (value: boolean) => void;
};

const PreferenceItem = ({ category, notificationTypeDetails, value, onUpdate }: PreferenceItemProps) => {
    const { t } = useTranslation();

    const Icon = notificationTypeDetails?.icon ? notificationTypeDetails?.icon : () => null;
    const notificationPreferenceInfos = getNotificationCategoriesData(category).allPrefs[category];

    const handleToggle = (preferenceValue: boolean) => {
        onUpdate(preferenceValue);
    };

    return (
        <Flex py={3} direction="row" justifyContent="space-between">
            <Flex w="80%">
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
            <Flex direction="row" justifyContent="center" w="10%">
                <Checkbox
                    borderColor={'primary.500'}
                    borderWidth={1}
                    value={notificationTypeDetails.title}
                    isChecked={value}
                    onChange={() => handleToggle(!value)}
                />
            </Flex>
        </Flex>
    );
};

export default PreferenceItem;
