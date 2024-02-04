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
                        addSubject={(it) => {
                            setEditedSubjects((prev) => [...prev, { name: it, mandatory: false }]);
                        }}
                        removeSubject={(it) => {
                            setEditedSubjects((prev) => prev.filter((s) => s.name !== it));
                        }}
                    />
                    {/* <Text>Priorisiertes Fach:</Text>
                    <Radio.Group
                        name="prioritized-subjects"
                        value={prioritizedSubject?.name}
                        onChange={(new_s) =>
                            updateSubjects(
                                pupil.subjectsFormatted.map((s) => {
                                    if (s.name === prioritizedSubject?.name) {
                                        return { ...s, mandatory: false };
                                    } else if (s.name === new_s) {
                                        return { ...s, mandatory: true };
                                    }
                                    return s;
                                })
                            )
                        }
                    >
                        <VStack space={space['1']}>
                            {pupil.subjectsFormatted.map((key) => (
                                <Radio key={key.name} value={key.name}>
                                    {key.name}
                                </Radio>
                            ))}
                        </VStack>
                            </Radio.Group> */}

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
