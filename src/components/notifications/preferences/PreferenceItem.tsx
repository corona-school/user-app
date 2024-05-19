import { Box, HStack, VStack, Text, Pressable, Circle, Spacer, useBreakpointValue, Modal } from 'native-base';
import { useTranslation } from 'react-i18next';
import { FC, useState } from 'react';
import { NotificationCategoryDetails } from '../../../helper/notification-preferences';
import InformationModal from './InformationModal';
import { getNotificationCategoriesData } from '../../../helper/notification-helper';
import InformationBadge from './InformationBadge';
import { Checkbox } from '@components/atoms/Checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/atoms/Tooltip';
import { Label } from '@components/atoms/Label';

type PrefProps = {
    category: string;
    notificationTypeDetails: NotificationCategoryDetails;
    value: boolean;
    onUpdate: (value: boolean) => void;
};

const PreferenceItem: React.FC<PrefProps> = ({ category, notificationTypeDetails, value, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { t } = useTranslation();

    const Icon: FC = notificationTypeDetails?.icon ? notificationTypeDetails?.icon : () => null;
    const notificationPreferenceInfos = getNotificationCategoriesData(category).allPrefs[category];

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const maxW = useBreakpointValue({
        base: 300,
        lg: '100%',
    });

    const width = useBreakpointValue({
        base: 340,
        lg: '100%',
    });

    const handleToggle = (preferenceValue: boolean) => {
        onUpdate(preferenceValue);
    };

    return (
        <Box borderBottomWidth={1} borderBottomColor={'gray.100'} py={3} width={width}>
            <HStack alignItems="center" space={1}>
                {notificationTypeDetails?.icon && (
                    <VStack>
                        <Icon />
                    </VStack>
                )}
                <VStack maxW={maxW}>
                    <Label htmlFor={`label-${value}`}>
                        {t(notificationTypeDetails.title)}
                        {isMobile ? (
                            <Box>
                                <Pressable ml={1} onPress={() => setIsModalOpen(true)}>
                                    <InformationBadge />
                                </Pressable>
                                <Modal bg="modalbg" isOpen={isModalOpen}>
                                    <InformationModal onPressClose={() => setIsModalOpen(false)} category={category} />
                                </Modal>
                            </Box>
                        ) : (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Circle rounded="full" bg="danger.100" size={4} ml={2}>
                                            <Text color={'white'}>i</Text>
                                        </Circle>
                                    </TooltipTrigger>
                                    <TooltipContent className="w-80">
                                        <p className="text-center">{t(notificationPreferenceInfos.modal.body)}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </Label>
                </VStack>
                <Spacer />
                <VStack>
                    <Checkbox id={`label-${value}`} value={notificationTypeDetails.title} checked={value} onCheckedChange={handleToggle} />
                </VStack>
            </HStack>
        </Box>
    );
};

export default PreferenceItem;
