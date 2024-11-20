import { Modal, Text, useTheme, Button, HStack } from 'native-base';
import { Pupil_Languages_Enum, Student_Languages_Enum } from '../../gql/graphql';
import { LanguageTagList, allLanguages } from '../../components/LanguageTag';
import { useState } from 'react';

type Language = Pupil_Languages_Enum | Student_Languages_Enum;

export function EditLanguagesModal<T extends Language>({
    languages,
    onClose,
    store,
}: {
    languages: T[];
    onClose: () => void;
    store: (languages: T[]) => void;
}) {
    const { space } = useTheme();
    const [selectedLanguages, setSelectedLanguages] = useState<T[]>(languages);

    return (
        <Modal size="xl" isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.Header>
                    <Text>Sprachen bearbeiten</Text>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <Text paddingY={space['1']}>Verfügbare Sprachen:</Text>
                    <LanguageTagList
                        languages={allLanguages.filter((it) => !selectedLanguages.includes(it as T))}
                        onPress={(it) => setSelectedLanguages((prev) => [...prev, it as T])}
                    />

                    <Text paddingY={space['1']}>Ausgewählte Sprachen:</Text>
                    <LanguageTagList languages={selectedLanguages} onPress={(it) => setSelectedLanguages((prev) => prev.filter((k) => k !== it))} />

                    <HStack paddingTop={space['2']} space={space['1']}>
                        <Button
                            onPress={() => {
                                store(selectedLanguages);
                                onClose();
                            }}
                        >
                            Speichern
                        </Button>
                        <Button variant="outline" onPress={onClose}>
                            Abbrechen
                        </Button>
                    </HStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
