import { Modal, Text, Button, useTheme, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';

type ConfirmProps = {
    header: string;
    confirmButtonText: string;
    description: string;
    onClose: () => void;
    onConfirm: () => void;
};
const CourseConfirm: React.FC<ConfirmProps> = ({ header, confirmButtonText, description, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <>
            <Modal.Content>
                <Modal.Header>{header}</Modal.Header>
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

export default CourseConfirm;
