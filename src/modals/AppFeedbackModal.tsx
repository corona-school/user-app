import { Button } from '@/components/Button';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { useMutation } from '@apollo/client';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '../gql';
import { toast } from 'sonner';
import { Label } from '@/components/Label';
import { TextArea } from '@/components/TextArea';
import { Input } from '@/components/Input';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Typography } from '@/components/Typography';

interface AddFeedbackModalProps {
    isOpen: boolean;
    onIsOpenChange: (value: boolean) => any;
}

const AppFeedbackModal = ({ isOpen, onIsOpenChange }: AddFeedbackModalProps) => {
    const { t } = useTranslation();
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
        const MAX_FILE_SIZE = 2 * 1024 * 1024;
        if (file?.size && file.size > MAX_FILE_SIZE) {
            toast.error(t('appFeedback.screenshotShouldNotBeBiggerThan', { size: '2' }));
            return;
        }

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

        toast.success(t('appFeedback.feedbackSuccessfullySent'));
        onIsOpenChange(false);
        setIsSending(false);
    };

    return (
        <Modal onOpenChange={onIsOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{`💬 ${t('appFeedback.modal.title')}`}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <Typography className="text-pretty max-w-[95%]">{t('appFeedback.modal.description')}</Typography>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="description">{t('appFeedback.modal.notesLabel')}*</Label>
                    <TextArea
                        className="resize-none h-20 w-full"
                        id="description"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t('appFeedback.modal.notesPlaceholder')}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="screenshot">{t('appFeedback.modal.screenshotLabel')}</Label>
                    <Input className="w-full" id="screenshot" type="file" accept="image/*" onChange={handleOnChangeFile} />
                </div>
                <div className="flex flex-col gap-y-1">
                    <div className="mb-2">
                        <Label>{t('appFeedback.modal.canWeContactPerMailLabel')}</Label>
                        <Typography variant="sm">{t('appFeedback.modal.canWeContactPerMailHelperText')}</Typography>
                    </div>
                    <RadioGroup
                        value={allowContact.toString()}
                        onValueChange={(nextValue) => {
                            setAllowContact(nextValue === 'true');
                        }}
                        className="flex flex-row gap-x-4"
                    >
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="no" value="false" />
                            <Label htmlFor="no">{t('no')}</Label>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="yes" value="true" />
                            <Label htmlFor="yes">{t('yes')}</Label>
                        </div>
                    </RadioGroup>
                </div>
                <ModalFooter>
                    <Button disabled={!notes.trim()} isLoading={isSending} onClick={handleOnSubmit}>
                        {t('appFeedback.modal.sendFeedback')}
                    </Button>
                </ModalFooter>
            </div>
        </Modal>
    );
};

export default AppFeedbackModal;
