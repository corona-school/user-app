import { Button, FormControl, Input, Modal, Row, TextArea, useTheme } from 'native-base';
import { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilePicker } from 'use-file-picker';
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
    const [message, setMessage] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const { t } = useTranslation();

    const maxFileSize = 10; // in MB
    const [openFileSelector, { filesContent, errors }] = useFilePicker({ maxFileSize, minFileSize: 0, multiple: true });

    const send = useCallback(async () => {
        if (filesContent) {
            let fileIDs: string[] = [];
            for (const file of filesContent) {
                const formData: FormData = new FormData();
                const data = new Blob([file.content]);
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
                }
            }
            onSend(subject, message, fileIDs);
        }
    }, [filesContent, message, onSend, subject]);

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
                        <TextArea onChangeText={setMessage} h={80} placeholder={t('helpcenter.contact.message.placeholder')} autoCompleteType={{}} />
                    </Row>
                    {filesContent.map((file) => (
                        <div key={file.name}>{file.name}</div>
                    ))}
                    <Button maxW="200px" w="100%" onPress={openFileSelector}>
                        {t('helpcenter.contact.fileupload.label')}
                    </Button>
                    {details}
                    {errors.length > 0 && (
                        <AlertMessage
                            content={
                                <>
                                    {errors[0].fileSizeToolarge && t('helpcenter.contact.fileupload.fileSizeToolarge', { maxSize: maxFileSize })}
                                    {errors[0].fileSizeTooSmall && t('helpcenter.contact.fileupload.fileSizeToSmall')}
                                    {errors[0].readerError && t('helpcenter.contact.fileupload.readerError')}
                                    {errors[0].maxLimitExceeded && t('helpcenter.contact.fileupload.maxLimitExceeded')}
                                    {errors[0].minLimitNotReached && t('helpcenter.contact.fileupload.minLimitNotReached')}
                                </>
                            }
                        />
                    )}
                    <AlertMessage
                        content={<>{isInstructor ? t('single.modals.contactMessage.alertInstructors') : t('single.modals.contactMessage.alertParticipants')}</>}
                    />
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
