import { useBreakpointValue, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { FC, useState } from 'react';
import { NotificationCategoryDetails } from '../../../helper/notification-preferences';
import InformationModal from './InformationModal';
import { getNotificationCategoriesData } from '../../../helper/notification-helper';
import InformationBadge from './InformationBadge';
import Checkbox from '@components/atoms/Checkbox';
import { Tooltip, Box, HStack, VStack, Text, IconButton, Flex, Circle, Spacer, Modal } from '@chakra-ui/react';

type PrefProps = {
    category: string;
    notificationTypeDetails: NotificationCategoryDetails;
    value: boolean;
    onUpdate: (value: boolean) => void;
};

const PreferenceItem: React.FC<PrefProps> = ({ category, notificationTypeDetails, value, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { colors } = useTheme();

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
            <HStack alignItems="center" spacing={1}>
                {notificationTypeDetails?.icon && (
                    <VStack>
                        <Icon />
                    </VStack>
                )}
                <Flex maxW={maxW} alignItems="center">
                    <Text margin={0} noOfLines={2}>
                        {t(notificationTypeDetails.title)}
                    </Text>
                    {isMobile ? (
                        <Box>
                            <IconButton
                                isRound
                                size="xs"
                                aria-label="Info"
                                icon={<InformationBadge />}
                                ml={1}
                                onClick={() => setIsModalOpen(true)}
                            ></IconButton>
                            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                                <InformationModal onPressClose={() => setIsModalOpen(false)} category={category} />
                            </Modal>
                        </Box>
                    ) : (
                        <Tooltip maxWidth={270} label={t(notificationPreferenceInfos.modal.body)} bg={colors['primary']['900']} p={3} hasArrow>
                            <Box as="span">
                                <Circle rounded="full" bg="primary.500" size={4} ml={2}>
                                    <Text color={'white'} margin={0}>
                                        i
                                    </Text>
                                </Circle>
                            </Box>
                        </Tooltip>
                    )}
                </Flex>
                <Spacer />
                <VStack>
                    <Checkbox size="lg" value={notificationTypeDetails.title} isChecked={value} onChange={() => handleToggle(!value)} />
                </VStack>
            </HStack>
        </Box>
    );
};

export default PreferenceItem;
