import { Button, Checkbox, Modal, Row, Text, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useApollo from '../hooks/useApollo';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import AlertMessage from '../widgets/AlertMessage';

export type ReportInfos = {
    messageId: string;
    message: string;
    messageType: string;
    sender: string;
    senderId: string;
    sentAt: string;
    conversationType: string;
    subject?: string;
    conversationId: string;
};

type ModalProps = {
    isOpen?: boolean;
    reportInfos: ReportInfos;
    onClose: () => void;
};

const ContactSupportModal: React.FC<ModalProps> = ({ onClose, isOpen, reportInfos }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const { user } = useApollo();
    const toast = useToast();

    const [dsgvo, setDSGVO] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    const [contactSupport, { data }] = useMutation(
        gql(`
        mutation SendReportOnSupport($subject: String! $message: String!) { 
	        userContactSupport(message: { subject: $subject message: $message })
        }
    `)
    );

    const sendReportMessage = async () => {
        const reportMessage = reportInfos
            ? `Sehr geehrtes Support-Team,

                ich möchte hiermit eine Nachricht melden, die in unserer aktuellen Unterhaltung aufgetreten ist. Die Details lauten wie folgt:
                
                In unserer Konversation sind folgende Daten relevant:
                
                Message: ${reportInfos.message}
                MessageId: ${reportInfos.messageId}
                MessageType: ${reportInfos.messageType}
                ConversationId: ${reportInfos.conversationId}
                ConversationType: ${reportInfos.conversationType}
                MessageSender: ${reportInfos.sender}
                MessageSenderId: ${reportInfos.senderId}
                SentAt: ${reportInfos.sentAt}
                
                Bitte die genannten Informationen überprüfen und gegebenenfalls erforderliche Maßnahmen ergreifen.

                Mit freundlichen Grüßen,
                ${user?.firstname} ${user?.lastname}
                `
            : 'Nachricht melden (keine Informationen)';

        const response = await contactSupport({
            variables: {
                subject: 'Nachricht melden',
                message: reportMessage,
            },
        });

        if (response.data?.userContactSupport) {
            toast.show({ description: t('helpcenter.reportSuccessToast'), placement: 'top' });
            onClose();
        } else setShowError(true);

        console.log('SEND REPORT ON SUPPORT');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content minW={800}>
                <Modal.CloseButton />
                <Modal.Header>{t('chat.report.modalHeader')}</Modal.Header>
                <Modal.Body>
                    <Row flexDirection="column" paddingY={space['1.5']}>
                        <Checkbox value="dsgvo" isChecked={dsgvo} onChange={(val) => setDSGVO(val)}>
                            <Text>{t('chat.report.modalMessage')}</Text>
                        </Checkbox>
                    </Row>
                    {showError && <AlertMessage content={t('helpcenter.contact.error')} />}
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['2']}>
                        <Button marginX="auto" isDisabled={!dsgvo} onPress={sendReportMessage}>
                            {t('helpcenter.btn.formsubmit')}
                        </Button>
                        <Button onPress={onClose}>{t('cancel')}</Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

export default ContactSupportModal;
