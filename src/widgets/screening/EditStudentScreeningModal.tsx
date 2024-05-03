import { Modal, Text, useTheme, Button, HStack, FormControl, Row, TextArea } from 'native-base';
import { useState } from 'react';
import { t } from 'i18next';

interface ScreeningFormData {
    comment?: string | null;
}

interface EditStudentScreeningModalProps {
    title: string;
    onSubmit: (data: ScreeningFormData) => void;
    isOpen: boolean;
    onClose: () => void;
    defaultValues: ScreeningFormData;
}

export function EditStudentScreeningModal({ title, isOpen, onClose, onSubmit, defaultValues }: EditStudentScreeningModalProps) {
    const { space } = useTheme();
    const [comment, setComment] = useState(defaultValues.comment || '');

    const handleOnSubmit = () => {
        onClose();
        onSubmit({ comment });
    };

    return (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.Header>
                    <Text>{title}</Text>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <Row flexDirection="column">
                            <FormControl.Label>{t('screening.comment')}</FormControl.Label>
                            <TextArea value={comment} onChangeText={setComment} h={300} autoCompleteType={{}} />
                        </Row>
                    </FormControl>

                    <HStack paddingTop={space['2']} space={space['1']}>
                        <Button onPress={handleOnSubmit}>Speichern</Button>
                        <Button variant="outline" onPress={onClose}>
                            {t('cancel')}
                        </Button>
                    </HStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
