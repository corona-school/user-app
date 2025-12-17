import { Box, Button, Heading, Modal, Text, useTheme, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import WarningIcon from '../assets/icons/lernfair/lf_caution.svg';

export enum RejectType {
    CANCEL = 'cancel',
    DECLINE = 'decline',
}
type ModalProps = {
    onDelete: () => void;
    close: () => void;
    rejectType: RejectType;
};
const RejectAppointmentModal: React.FC<ModalProps> = ({ onDelete, close, rejectType }) => {
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
                        <Heading minW="280" fontSize="lg" textAlign="center" color="lightText">
                            {rejectType === RejectType.CANCEL ? t('appointment.deleteModal.title') : t('appointment.declineModal.title')}
                        </Heading>
                        <Text minW="220" textAlign="center" color="lightText">
                            {rejectType === RejectType.CANCEL ? t('appointment.deleteModal.description') : t('appointment.declineModal.description')}
                        </Text>
                    </VStack>

                    <VStack space="3">
                        <Button bgColor="danger.100" _text={{ color: 'white' }} onPress={onDelete}>
                            {rejectType === RejectType.CANCEL ? t('appointment.deleteModal.delete') : t('appointment.declineModal.decline')}
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

export default RejectAppointmentModal;
