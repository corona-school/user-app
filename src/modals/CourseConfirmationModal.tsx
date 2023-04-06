import { Modal, Text, Button, useTheme, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

type ConfirmProps = {
    headline: string;
    confirmButtonText: string;
    description: ReactNode;
    onClose: () => void;
    onConfirm: () => void;
};
const CourseConfirmationModal: React.FC<ConfirmProps> = ({ headline, confirmButtonText, description, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <>
            <Modal.Content>
                <Modal.Header>{headline}</Modal.Header>
                <Modal.CloseButton />
                <Modal.Body>
                    <Text marginBottom={space['1']}>{description}</Text>
                    <Stack space={space['0.5']} direction="column">
                        <Button onPress={onConfirm}>{confirmButtonText}</Button>
                        <Button variant="outline" onPress={onClose}>
                            {t('cancel')}
                        </Button>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default CourseConfirmationModal;
