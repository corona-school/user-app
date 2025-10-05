import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { toast } from 'sonner';
import { Typography } from '@/components/Typography';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { Button } from '@/components/Button';

interface ContactModalProps extends BaseModalProps {}

export const ContactSupportModal = ({ isOpen, onOpenChange }: ContactModalProps) => {
    const { t } = useTranslation();

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [contactSupport, { loading }] = useMutation(
        gql(`
        mutation SendReportOnSupport($subject: String! $message: String!) { 
	        userContactSupport(message: { subject: $subject message: $message })
        }
    `)
    );

    const sendReportMessage = async () => {
        const response = await contactSupport({
            variables: {
                subject,
                message,
            },
        });

        if (response.data?.userContactSupport) {
            toast.success(t('contactSupport.success'));
            onOpenChange(false);
        } else toast.error(t('contactSupport.failure'));
    };

    return (
        <Modal className="w-full md:max-w-[800px] px-2 md:px-6" onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader className="px-2">
                <ModalTitle>{t('contactSupport.title')}</ModalTitle>
            </ModalHeader>
            <div className="md:max-h-[500px] overflow-auto px-2">
                <Typography className="pb-1.5">{t('contactSupport.content')}</Typography>
                <Typography className="italic pb-1.5">
                    <Trans
                        i18nKey="contactSupport.legal"
                        components={{
                            privacy: (
                                <a target="_blank" href="https://lern-fair.de/datenschutz" rel="noreferrer">
                                    Datenschutz
                                </a>
                            ),
                        }}
                    />
                </Typography>
                <div className="mb-10">
                    <div className="flex flex-col py-0.5">
                        <Label>{t('contactSupport.titleLabel')}</Label>
                        <Input value={subject} onChangeText={setSubject} />
                    </div>
                    <div className="flex flex-col py-0.5">
                        <Label>{t('contactSupport.contentLabel')}</Label>
                        <TextArea value={message} onChangeText={setMessage} placeholder={t('contactSupport.contentPlaceholder')} className="resize-none" />
                    </div>
                </div>
                <ModalFooter>
                    <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('cancel')}
                    </Button>
                    <Button disabled={!subject || !message} className="w-full lg:w-fit" isLoading={loading} onClick={sendReportMessage}>
                        {t('contactSupport.submit')}
                    </Button>
                </ModalFooter>
            </div>
        </Modal>
    );
};
