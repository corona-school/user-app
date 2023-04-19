import { Box, CloseIcon, Heading, Modal, Pressable, useTheme, Row, Button, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import { getIconForNotificationPreferenceModal } from '../../helper/notification-helper';

type Props = {
    messageType: string;
    headline?: string;
    modalText: string;
    onClose: () => any;
};
const AppointmentCancelledModal: React.FC<Props> = ({ messageType, onClose, headline, modalText }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    const Icon = getIconForNotificationPreferenceModal(messageType);

    return (
        <>
            <Modal.Content width="350" marginX="auto" backgroundColor="transparent">
                <Box position="absolute" zIndex="1" right="20px" top="14px">
                    <Pressable onPress={onClose}>
                        <CloseIcon color="white" />
                    </Pressable>
                </Box>
                <Modal.Body background="primary.900" padding={space['1']}>
                    <Box alignItems="center" marginY={space['1']}>
                        <Icon />
                    </Box>
                    <Box paddingY={space['2']} maxW={'100%'}>
                        {headline && (
                            <Heading maxWidth="330px" marginX="auto" fontSize="lg" textAlign={'center'} color="lightText" marginBottom={space['0.5']}>
                                {headline}
                            </Heading>
                        )}
                        <Text my={2} textAlign={'center'} fontSize="sm" color="lightText">
                            {modalText}
                        </Text>
                    </Box>
                    <Box>
                        <Row marginBottom={space['0.5']}>
                            <Button variant={'outlinelight'} onPress={onClose} width="100%">
                                {t('notification.controlPanel.closeButton')}
                            </Button>
                        </Row>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default AppointmentCancelledModal;
