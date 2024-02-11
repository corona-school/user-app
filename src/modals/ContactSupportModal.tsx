import { Button, Checkbox, FormControl, Heading, Input, Modal, Row, Text, TextArea, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useApollo from '../hooks/useApollo';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import AlertMessage from '../widgets/AlertMessage';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import DisableableButton from '../components/DisablebleButton';

type ModalProps = {
    isOpen?: boolean;
    onClose: () => void;
};

export const ContactSupportModal: React.FC<ModalProps> = ({ onClose, isOpen }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const toast = useToast();
    const { isMobile } = useLayoutHelper();

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
            toast.show({ description: t('contactSupport.success'), placement: 'top' });
            onClose();
        } else toast.show({ description: t('contactSupport.failure') });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content minW={isMobile ? '90vw' : 800}>
                <Modal.CloseButton />
                <Modal.Header>{t('contactSupport.title')}</Modal.Header>
                <Modal.Body>
                    <Text paddingBottom={space['1.5']}>{t('contactSupport.content')}</Text>
                    <Text fontSize="xs">{t('contactSupport.legalNote')}</Text>

                    <FormControl>
                        <Row flexDirection="column" paddingY={space['0.5']}>
                            <FormControl.Label>{t('contactSupport.titleLabel')}</FormControl.Label>
                            <Input value={subject} onChangeText={setSubject} />
                        </Row>
                        <Row flexDirection="column" paddingY={space['0.5']}>
                            <FormControl.Label>{t('contactSupport.contentLabel')}</FormControl.Label>
                            <TextArea
                                value={message}
                                onChangeText={setMessage}
                                h={500}
                                placeholder={t('contactSupport.contentPlaceholder')}
                                autoCompleteType={{}}
                            />
                        </Row>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['2']}>
                        <DisableableButton
                            isDisabled={loading || !subject || !message}
                            marginX="auto"
                            reasonDisabled={t('contactSupport.disabled')}
                            onPress={sendReportMessage}
                        >
                            {t('contactSupport.submit')}
                        </DisableableButton>
                        <Button onPress={onClose}>{t('cancel')}</Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
