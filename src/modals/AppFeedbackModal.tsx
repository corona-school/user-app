import { useMutation } from '@apollo/client';
import { useTheme, Row, Button, Modal, Text, FormControl, TextArea, Heading, Radio, Box, useToast } from 'native-base';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '../gql';

interface AddFeedbackModalProps {
    isOpen?: boolean;
    onClose: () => any;
}

const AppFeedbackModal = ({ isOpen, onClose }: AddFeedbackModalProps) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const [notes, setNotes] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setFile(undefined);
        setNotes('');
        setAllowContact(false);
    }, [isOpen]);

    const [sendAppFeedback] = useMutation(
        gql(`
        mutation SendAppFeedback($allowContact: Boolean!, $notes: String!, $attachment: AppFeedbackAttachment) {
            userSendAppFeedback(
                message: {
                    allowContact: $allowContact
                    notes: $notes
                    attachment: $attachment
                }
            )
        }
    `)
    );
    const [allowContact, setAllowContact] = useState(false);
    const [file, setFile] = useState<File | undefined>();

    const handleOnChangeFile: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFile(e.target.files?.item(0) ?? undefined);
    };

    const toBase64 = (file: File) =>
        new Promise<string | undefined>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result?.toString().split(',').pop());
            reader.onerror = reject;
        });

    const handleOnSubmit = async () => {
        setIsSending(true);
        const base64 = file ? await toBase64(file) : null;
        await sendAppFeedback({
            variables: {
                notes,
                allowContact,
                attachment:
                    file && base64
                        ? {
                              Base64Content: base64,
                              ContentType: file.type,
                              Filename: file.name,
                          }
                        : undefined,
            },
        });
        toast.show({ description: t('appFeedback.feedbackSuccessfullySent') });
        onClose();
        setIsSending(false);
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen} size="lg">
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>
                    <Heading fontSize="lg">{`💬 ${t('appFeedback.modal.title')}`}</Heading>
                </Modal.Header>
                <Modal.Body>
                    <Text fontSize="sm">{t('appFeedback.modal.description')}</Text>
                    <FormControl>
                        <Row flexDirection="column" paddingY={space['0.5']}>
                            <FormControl.Label _text={{ color: 'primary.900' }}>{t('appFeedback.modal.notesLabel')}*</FormControl.Label>
                            <TextArea
                                value={notes}
                                onChangeText={setNotes}
                                h={20}
                                placeholder={t('appFeedback.modal.notesPlaceholder')}
                                autoCompleteType={{}}
                            />
                        </Row>
                    </FormControl>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label _text={{ color: 'primary.900' }}>{t('appFeedback.modal.screenshotLabel')}*</FormControl.Label>
                        <input type="file" accept="image/*" onChange={handleOnChangeFile} />
                    </Row>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label _text={{ color: 'primary.900' }}>{t('appFeedback.modal.canWeContactPerMailLabel')}*</FormControl.Label>
                        <Text fontSize="sm" mb="4">
                            {t('appFeedback.modal.canWeContactPerMailHelperText')}
                        </Text>
                        <Radio.Group
                            name="allowContact"
                            accessibilityLabel={t('appFeedback.modal.canWeContactPerMailLabel')}
                            value={allowContact.toString()}
                            onChange={(nextValue) => {
                                setAllowContact(nextValue === 'true');
                            }}
                        >
                            <Row>
                                <Box mr="4">
                                    <Radio value="false">{t('no')}</Radio>
                                </Box>
                                <Box>
                                    <Radio value="true">{t('yes')}</Radio>
                                </Box>
                            </Row>
                        </Radio.Group>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['1']}>
                        <Button isDisabled={!notes} isLoading={isSending} isLoadingText={t('appFeedback.modal.sendFeedback')} onPress={handleOnSubmit}>
                            {t('appFeedback.modal.sendFeedback')}
                        </Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

export default AppFeedbackModal;
