import { Button, FormControl, Input, Modal, Row, TextArea, useTheme } from 'native-base';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertMessage from '../widgets/AlertMessage';

type Props = {
    isOpen?: boolean;
    isDisabled?: boolean;
    onClose?: () => void;
    onSend: (subject: string, message: string) => void;
    isInstructor: boolean;
    details?: ReactElement;
};

const SendParticipantsMessageModal: React.FC<Props> = ({ isOpen, onClose, onSend, isDisabled, isInstructor, details }) => {
    const { space } = useTheme();
    const [message, setMessage] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="1000px">
                <Modal.CloseButton />
                <Modal.Header>{t('sendMessage')}</Modal.Header>
                <Modal.Body>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label>{t('helpcenter.contact.subject.label')}</FormControl.Label>
                        <Input onChangeText={setSubject} />
                    </Row>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label>{t('helpcenter.contact.message.label')}</FormControl.Label>
                        <TextArea onChangeText={setMessage} h={80} placeholder={'Deine Nachricht'} autoCompleteType={{}} />
                    </Row>
                    {details}
                    <AlertMessage
                        content={
                            <>
                                Wir teilen {isInstructor ? 'deinen Teilnehmer:innen' : 'deinen Kursleiter:innen'} deine E-Mail Adresse mit, sodass ihr bei
                                Bedarf via E-Mail weiter kommunizieren könnt.
                            </>
                        }
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['1']}>
                        <Button variant="outline" onPress={onClose} isDisabled={isDisabled}>
                            {t('cancel')}
                        </Button>
                        <Button onPress={() => onSend(subject, message)} isDisabled={isDisabled}>
                            {t('send')}
                        </Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default SendParticipantsMessageModal;
