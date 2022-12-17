import { Text, Modal, Row, Button, useTheme } from 'native-base';

type Props = {
    isOpen?: boolean;
    onClose: () => any;
    onCourseCancel: () => any;
};

const CancelSubCourseModal: React.FC<Props> = ({ isOpen, onClose, onCourseCancel }) => {
    const { space } = useTheme();
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Kurs absagen</Modal.Header>
                <Modal.Body>
                    <Text>
                        Wenn du den Kurs absagst, werden alle Termine abgesagt und die teilnehmenden Schüler:innen über diese Änderung per E-Mail informiert.
                        Bist du dir sicher, dass du den Kurs absagen möchtest?
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['1']}>
                        <Button variant="outline" onPress={onCourseCancel}>
                            Kurs absagen
                        </Button>
                        <Button onPress={onClose}>Abbrechen</Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default CancelSubCourseModal;
