import { Box, Button, Modal, Text, useTheme, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import WarningIcon from '../assets/icons/lernfair/lf_caution.svg';

type ModalProps = {
    onDelete: () => void;
    close: () => void;
};
const DeleteAppointmentModal: React.FC<ModalProps> = ({ onDelete, close }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <>
            <Modal.Content width="320" marginX="auto" background="primary.900">
                <Modal.CloseButton onPress={close} />
                <Modal.Body padding={space['1']}>
                    <Box alignItems="center" marginTop={space['1']}>
                        <WarningIcon />
                    </Box>
                    <VStack space="3" marginY={space['1']} alignItems="center">
                        <Text width="280" textAlign={'center'} color="white" fontSize="sm">
                            {t('appointment.deleteModal.title')}
                        </Text>
                        <Text width="224" textAlign={'center'} color="lightText" fontWeight="thin" fontSize="xs">
                            {t('appointment.deleteModal.description')}
                        </Text>
                    </VStack>

                    <VStack space="3">
                        <Button bgColor="danger.100" _text={{ color: 'white' }} onPress={onDelete}>
                            {t('appointment.deleteModal.delete')}
                        </Button>
                        <Button variant="outline" _text={{ color: 'primary.400' }} onPress={close}>
                            {t('appointment.deleteModal.cancel')}
                        </Button>
                    </VStack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default DeleteAppointmentModal;
