import { Text, Modal, Button, useTheme, Column } from 'native-base';
import { useTranslation } from 'react-i18next';

type Props = {
    header: string;
    description: string;
    buttons?: {
        label: string;
        btnfn: (() => void) | null;
    }[];
    isOpen?: boolean;
    onClose: () => any;
};

const NextStepModal: React.FC<Props> = ({ header, description, buttons, isOpen, onClose }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{header}</Modal.Header>
                <Modal.Body>
                    <Text>{description}</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Column space={space['1']} width="100%">
                        {buttons?.map((btn) => (
                            <Button
                                variant="outline"
                                onPress={() => {
                                    btn.btnfn && btn.btnfn();
                                }}
                            >
                                {btn.label}
                            </Button>
                        ))}
                        <Button onPress={onClose}>{t('cancel')}</Button>
                    </Column>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default NextStepModal;
