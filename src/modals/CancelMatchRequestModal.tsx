import { Text, Modal, Row, Button, useTheme } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    showModal: boolean;
    onClose: () => any;
    onShareFeedback: (feedback: string) => any;
    onSkipShareFeedback: () => any;
};

const CancelMatchRequestModal: React.FC<Props> = ({ showModal, onClose, onShareFeedback, onSkipShareFeedback }) => {
    const [feedback, setFeedback] = useState<string>();
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('matching.pending.modal.title')}</Modal.Header>
                <Modal.Body>
                    <Text>{t('matching.pending.modal.description')}</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['1']}>
                        <Button onPress={() => onShareFeedback(feedback!)}>{t('matching.pending.modal.buttons.dissolve')}</Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default CancelMatchRequestModal;
