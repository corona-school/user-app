import { Modal, Row, Text, useTheme } from 'native-base';
import { GradeSelector } from '../../components/GradeSelector';

export function EditGradeModal({ grade, onClose, store }: { grade: number; onClose: () => void; store: (grade: number) => void }) {
    const { space } = useTheme();
    return (
        <Modal size="xl" isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.Header>
                    <Text>Klasse bearbeiten</Text>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['1']}>
                        <GradeSelector
                            grade={grade}
                            onGradeChange={(grade) => {
                                store(grade);
                                onClose();
                            }}
                        />
                    </Row>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
