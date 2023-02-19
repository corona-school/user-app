import { Text, Modal, Row, Button, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';

type Props = {
    isOpen?: boolean;
    onClose: () => any;
    onCourseCancel: () => any;
};

const CancelSubCourseModal: React.FC<Props> = ({ isOpen, onClose, onCourseCancel }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('course.cancel.header')}</Modal.Header>
                <Modal.Body>
                    <Text>{t('course.cancel.description')}</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['1']}>
                        <Button variant="outline" onPress={onCourseCancel}>
                            {t('course.cancel.header')}
                        </Button>
                        <Button onPress={onClose}>{t('cancel')}</Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default CancelSubCourseModal;
