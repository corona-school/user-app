import { Box, Button, Modal, Text, useTheme, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import WarningIcon from '../assets/icons/lernfair/lf-warning.svg';

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
                    <Box alignItems="center" marginTop={space['2']}>
                        <WarningIcon />
                    </Box>
                    <VStack space="3" marginY={space['2']}>
                        <Text textAlign={'center'} color="white">
                            {t('appointment.deleteModal.title')}
                        </Text>
                        <Text textAlign={'center'} color="lightText" fontWeight="light" fontSize="sm">
                            {t('appointment.deleteModal.description')}
                        </Text>
                    </VStack>

                    <VStack space={3}>
                        <Button bgColor="amber.700" _text={{ color: 'white' }} onPress={onDelete}>
                            {t('appointment.deleteModal.delete')}
                        </Button>
                        <Button variant="outline" _text={{ color: 'primary.100' }} onPress={close}>
                            {t('appointment.deleteModal.cancel')}
                        </Button>
                    </VStack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default DeleteAppointmentModal;
