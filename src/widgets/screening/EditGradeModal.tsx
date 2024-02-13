import { Modal, Text, useTheme } from 'native-base';
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
                    <GradeSelector
                        grade={grade}
                        setGrade={(grade) => {
                            store(grade);
                            onClose();
                        }}
                    />
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
