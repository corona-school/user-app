import { Button, Modal, Row, Text, useBreakpointValue, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';

type ModalProps = {
    showAdHocModal: boolean;
    onPressAdHocMeeting: () => void;
    onPressBack: () => void;
};

export const studentReasonOptions = new Array(9).fill(0);
export const pupilReasonOptions = new Array(9).fill(0);

const AdHocMeetingModal: React.FC<ModalProps> = ({ showAdHocModal, onPressAdHocMeeting, onPressBack }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    const minWidth = useBreakpointValue({
        base: '90%',
        lg: '500px',
    });
    return (
        <Modal isOpen={showAdHocModal} onClose={onPressBack}>
            <Modal.Content minW={minWidth}>
                <Modal.CloseButton />
                <>
                    <Modal.Header>{t('matching.adHocMeeting.title')}</Modal.Header>
                    <Modal.Body>
                        <Text p={space['0.5']}>{t('matching.adHocMeeting.infoText')}</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row space={space['2']}>
                            <Button onPress={() => onPressBack()} variant="ghost">
                                {t('cancel')}
                            </Button>
                            <Button onPress={() => onPressAdHocMeeting()}>{t('matching.adHocMeeting.startMeeting')}</Button>
                        </Row>
                    </Modal.Footer>
                </>
            </Modal.Content>
        </Modal>
    );
};

export default AdHocMeetingModal;
