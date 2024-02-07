import { Radio, VStack, Modal, Text, useTheme, Stack, Button } from 'native-base';
import { SubjectSelector } from '../SubjectSelector';
import { Subject } from '../../gql/graphql';
import { useState } from 'react';

export function EditSubjectsModal({ subjects, onClose, store }: { subjects: Subject[]; onClose: () => void; store: (subjects: Subject[]) => void }) {
    const { space } = useTheme();
    const [editedSubjects, setEditedSubjects] = useState<Subject[]>(subjects);

    return (
        <Modal size="full" isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.Header>
                    <Text>Fächer bearbeiten</Text>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <SubjectSelector
                        subjects={editedSubjects.map((it) => it.name)}
                        includeDaz
                        addSubject={(it) => {
                            setEditedSubjects((prev) => [...prev, { name: it, mandatory: false }]);
                        }}
                        removeSubject={(it) => {
                            setEditedSubjects((prev) => prev.filter((s) => s.name !== it));
                        }}
                    />

                    <Text bold>Priorisiertes Fach:</Text>
                    <Stack direction="row">
                        <SubjectSelector
                            selectable={editedSubjects.map((it) => it.name)}
                            subjects={editedSubjects.filter((it) => it.mandatory).map((it) => it.name)}
                            limit={1}
                            addSubject={(it) => setEditedSubjects((prev) => prev.map(({ name }) => ({ name, mandatory: name === it })))}
                            removeSubject={() => setEditedSubjects((prev) => prev.map(({ name }) => ({ name, mandatory: false })))}
                            justifyContent="left"
                        />
                    </Stack>
                    <Stack direction="row" space={space['1']}>
                        <Button variant="outline" onPress={onClose}>
                            Abbrechen
                        </Button>
                        <Button
                            onPress={() => {
                                store(editedSubjects);
                                onClose();
                            }}
                        >
                            Speichern
                        </Button>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
