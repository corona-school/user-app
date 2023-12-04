import { Heading, View, Text, FormControl, Row, Input, TextArea, Checkbox, Link, useTheme, useBreakpointValue, Button, useToast } from 'native-base';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertMessage from '../widgets/AlertMessage';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import DisablebleButton from './DisablebleButton';

type FormularProps = {};

const ContactSupportForm: React.FC<FormularProps> = () => {
    const [subject, setSubject] = useState<string>('');
    const [dsgvo, setDSGVO] = useState<boolean>(false);
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

    const isButtonDisabled = useMemo(() => {
        return !dsgvo || message?.length < 5 || subject?.length < 5;
    }, [dsgvo, message?.length, subject?.length]);

    const reasonDisabled = useMemo(() => {
        const reasons = t('helpcenter.btn.reasonDisabled', { returnObjects: true });

        if (subject?.length < 5) return reasons[0];
        if (message?.length < 5) return reasons[1];
        if (!dsgvo) return reasons[2];

        return '';
    }, [dsgvo, message?.length, subject?.length]);

    return (
        <View paddingLeft={space['1.5']}>
            <>
                <Heading paddingBottom={space['0.5']}>{t('helpcenter.contact.title')}</Heading>
                <Text paddingBottom={space['1.5']}>{t('helpcenter.contact.content')}</Text>

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
                <Row flexDirection="column" paddingY={space['1.5']}>
                    <Checkbox value="dsgvo" isChecked={dsgvo} onChange={(val) => setDSGVO(val)}>
                        <Text>
                            Ich habe die <Link onPress={() => window.open('/datenschutz', '_blank')}> Datenschutzbestimmungen</Link> zur Kenntnis genommen und
                            bin damit einverstanden, dass meine persönlichen Daten entsprechend des Zwecks, Umfangs und der Dauer wie in der
                            Datenschutzerklärung angegeben, verarbeitet und gespeichert werden. Ich nehme zur Kenntnis, dass die Verarbeitung meiner
                            personenbezogenen Daten über die in den USA sitzenden Auftragsverarbeitern Google und Zapier stattfindet, die die Einhaltung des
                            europäischen Datenschutzniveaus aufgrund der Möglichkeit von Anfragen von US-Nachrichtendiensten nicht gewährleisten können. Zu
                            diesem Zweck hat Lern-Fair Standardvertragsklauseln abgeschlossen und weitergehende Sicherheitsmaßnahmen vereinbart, Art. 46 Abs. 2
                            lit. c DSGVO. Alternativ ist eine Kontaktierung per E-Mail an{' '}
                            <Link onPress={() => (window.location.href = 'mailto:support@lern-fair.de?subject=Kontakt%20Userbereich')}>
                                support@lern-fair.de
                            </Link>{' '}
                            möglich.
                        </Text>
                    </Checkbox>
                </Row>

                <Row flexDirection="column" paddingY={space['0.5']}>
                    {messageSent && <AlertMessage content={t('helpcenter.contact.success')} />}
                    {showError && <AlertMessage content={t('helpcenter.contact.error')} />}
                    <DisablebleButton
                        isDisabled={isButtonDisabled}
                        reasonDisabled={reasonDisabled}
                        buttonProps={{
                            marginX: 'auto',
                            width: buttonWidth,
                            onPress: sendContactMessage,
                        }}
                    >
                        {t('helpcenter.btn.formsubmit')}
                    </DisablebleButton>
                </Row>
            </FormControl>
        </View>
    );
};

export default ContactSupportForm;
