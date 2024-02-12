import { Radio, VStack, Modal, Text, useTheme, Stack, Button, HStack } from 'native-base';
import { Pupil_Languages_Enum } from '../../gql/graphql';
import { LanguageTagList, allLanguages } from '../../components/LanguageTag';
import { useState } from 'react';

export function EditLanguagesModal({
    languages,
    onClose,
    store,
}: {
    languages: Pupil_Languages_Enum[];
    onClose: () => void;
    store: (languages: Pupil_Languages_Enum[]) => void;
}) {
    const { space } = useTheme();
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(languages);

    return (
        <Modal size="xl" isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.Header>
                    <Text>Fächer bearbeiten</Text>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <Text paddingY={space['1']}>Verfügbare Sprachen:</Text>
                    <LanguageTagList
                        languages={allLanguages.filter((it) => !selectedLanguages.includes(it))}
                        onPress={(it) => setSelectedLanguages((prev) => [...prev, it])}
                    />

                    <Text paddingY={space['1']}>Ausgewählte Sprachen:</Text>
                    <LanguageTagList languages={selectedLanguages} onPress={(it) => setSelectedLanguages((prev) => prev.filter((k) => k !== it))} />

                    <HStack paddingTop={space['2']} space={space['1']}>
                        <Button
                            onPress={() => {
                                store(selectedLanguages as Pupil_Languages_Enum[]);
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
