import { Button, Card, DeleteIcon, FormControl, Input, Modal, Row, Stack, Text, TextArea, useTheme } from 'native-base';
import { createRef, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import AlertMessage from '../widgets/AlertMessage';

type Props = {
    isOpen?: boolean;
    isDisabled?: boolean;
    onClose?: () => void;
    onSend: (subject: string, message: string, fileIDs: string[]) => void;
    isInstructor: boolean;
    details?: ReactElement;
};

const SendParticipantsMessageModal: React.FC<Props> = ({ isOpen, onClose, onSend, isDisabled, isInstructor, details }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const [message, setMessage] = useState<string>('');
    const [subject, setSubject] = useState<string>('');

    const [files, setFiles] = useState<File[]>([]);

    const [noSubjectError, setNoSubjectError] = useState<string>();
    const [noMessageError, setNoMessageError] = useState<string>();
    const [sendError, setSendError] = useState<string>();

    useEffect(() => {
        if (!message) {
            setNoMessageError(t('helpcenter.contact.message.error'));
        } else {
            setNoMessageError(undefined);
        }
    }, [message]);

    useEffect(() => {
        if (!subject) {
            setNoSubjectError(t('helpcenter.contact.subject.error'));
        } else {
            setNoSubjectError(undefined);
        }
    }, [subject]);

    const send = useCallback(async () => {
        if (message && subject && files) {
            let fileIDs: string[] = [];
            for (const file of files) {
                const formData: FormData = new FormData();
                const data = new Blob([file], { type: file.type });
                formData.append('file', data, file.name);
                try {
                    const fileID = await (
                        await fetch(BACKEND_URL + '/api/files/upload', {
                            method: 'POST',
                            body: formData,
                        })
                    ).text();
                    fileIDs.push(fileID);
                } catch (e) {
                    console.error(e);
                    setSendError(t('helpcenter.contact.error'));
                    break;
                }
            }
            onSend(subject, message, fileIDs);
        }
    }, [files, message, onSend, subject]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="1000px">
                <Modal.CloseButton />
                <Modal.Header>{t('sendMessage')}</Modal.Header>
                <Modal.Body>
                    <AlertMessage
                        content={<>{isInstructor ? t('single.modals.contactMessage.alertInstructors') : t('single.modals.contactMessage.alertParticipants')}</>}
                    />
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label>{t('helpcenter.contact.subject.label')}</FormControl.Label>
                        <Input onChangeText={setSubject} />
                    </Row>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label>{t('helpcenter.contact.message.label')}</FormControl.Label>
                        <TextArea onChangeText={setMessage} h={80} placeholder={t('helpcenter.contact.message.placeholder')} autoCompleteType={{}} />
                    </Row>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FileUploader
                            handleFileChange={(files: File[]) => {
                                setFiles(files);
                            }}
                        />
                    </Row>
                    {details}
                    {noSubjectError && <AlertMessage content={noSubjectError} />}
                    {noMessageError && <AlertMessage content={noMessageError} />}
                    {sendError && <AlertMessage content={sendError} />}
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['1']}>
                        <Button variant="outline" onPress={onClose} isDisabled={isDisabled}>
                            {t('cancel')}
                        </Button>
                        <Button onPress={send} isDisabled={isDisabled}>
                            {t('send')}
                        </Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default SendParticipantsMessageModal;
