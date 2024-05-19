import { Box, Heading, Text, Row, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { getIconForNotificationPreferenceModal, getNotificationCategoriesData } from '../../../helper/notification-helper';
import { ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import Button from '@components/atoms/Button';

type Props = {
    onPressClose?: () => any;
    category: string;
};

const InformationModal: React.FC<Props> = ({ onPressClose, category }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    const data = getNotificationCategoriesData(category);
    const modaldata = data.allPrefs[category];
    const Icon = getIconForNotificationPreferenceModal(category);

    return (
        <>
            <ModalOverlay />
            <ModalContent width="307px" marginY="auto" backgroundColor="transparent">
                <ModalCloseButton color="white" />
                <ModalBody background="primary.900" padding={space['1']}>
                    <Box alignItems="center" marginY={space['1']}>
                        <Icon />
                    </Box>
                    <Box paddingY={space['1']}>
                        <Heading maxWidth="330px" marginX="auto" fontSize="md" textAlign="center" color="lightText" marginBottom={space['0.5']}>
                            {t(modaldata.title)}
                        </Heading>
                        <Text textAlign="center" color="lightText" maxWidth="330px" marginX="auto">
                            {t(modaldata.modal.body)}
                        </Text>
                    </Box>
                    <Box paddingY={space['1']}>
                        <Row marginBottom={space['0.5']}>
                            <Button colorScheme="hero" onClick={onPressClose} width="100%">
                                {t('notification.controlPanel.closeButton')}
                            </Button>
                        </Row>
                    </Box>
                </ModalBody>
            </ModalContent>
        </>
    );
};

export default InformationModal;
