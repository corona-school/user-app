import { Heading, View, Text, FormControl, Row, Input, TextArea, Checkbox, Link, useTheme, useBreakpointValue } from 'native-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertMessage from '../widgets/AlertMessage';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import DisableableButton from './DisablebleButton';

type FormularProps = {};

const ContactSupportForm: React.FC<FormularProps> = () => {
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messageSent, setMessageSent] = useState<boolean>();
    const [showError, setShowError] = useState<boolean>();

    const { space, sizes } = useTheme();
    const { t } = useTranslation();

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });
    const [contactSupport, { data }] = useMutation(
        gql(`
        mutation ContactSupport($subject: String! $message: String!) { 
	        userContactSupport(message: { subject: $subject message: $message })
        }
    `)
    );

    const sendContactMessage = useCallback(async () => {
        const response = await contactSupport({
            variables: {
                subject,
                message,
            },
        });

        if (response.data?.userContactSupport) {
            setMessageSent(true);
        } else {
            setShowError(true);
        }
    }, [contactSupport, message, subject]);

    const isButtonDisabled = () => {
        return message?.length < 5 || subject?.length < 5;
    };

    const reasonDisabled = () => {
        const reasons = t('helpcenter.btn.reasonDisabled', { returnObjects: true });

        if (subject?.length < 5) return reasons[0];
        if (message?.length < 5) return reasons[1];

        return '';
    };

    return (
        <View paddingLeft={space['1.5']}>
            <>
                <Heading paddingBottom={space['0.5']}>{t('helpcenter.contact.title')}</Heading>
                <Text paddingBottom={space['0.5']}>{t('helpcenter.contact.content')}</Text>
                <Text paddingBottom={space['1.5']} fontSize="xs">
                    {t('contactSupport.legalNote')}
                </Text>
                <FormControl maxWidth={ContentContainerWidth}>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label>{t('helpcenter.contact.subject.label')}</FormControl.Label>
                        <Input value={subject} onChangeText={setSubject} />
                    </Row>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label>{t('helpcenter.contact.message.label')}</FormControl.Label>
                        <TextArea
                            value={message}
                            onChangeText={setMessage}
                            h={20}
                            placeholder={t('helpcenter.contact.message.placeholder')}
                            autoCompleteType={{}}
                        />
                    </Row>
                </FormControl>
            </>

            <FormControl>
                <Row flexDirection="column" paddingY={space['1.5']}></Row>

                <Row flexDirection="column" paddingY={space['0.5']}>
                    {messageSent && <AlertMessage content={t('helpcenter.contact.success')} />}
                    {showError && <AlertMessage content={t('helpcenter.contact.error')} />}
                    <DisableableButton
                        isDisabled={isButtonDisabled()}
                        reasonDisabled={reasonDisabled()}
                        marginX="auto"
                        width={buttonWidth}
                        onPress={sendContactMessage}
                    >
                        {t('helpcenter.btn.formsubmit')}
                    </DisableableButton>
                </Row>
            </FormControl>
        </View>
    );
};

export default ContactSupportForm;
