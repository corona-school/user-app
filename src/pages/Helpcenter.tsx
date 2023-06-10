import { Box, Heading, useTheme, Text, Link, Row, FormControl, TextArea, Checkbox, Button, InfoIcon, useBreakpointValue, View, Input } from 'native-base';
import Tabs from '../components/Tabs';
import WithNavigation from '../components/WithNavigation';
import { useCallback, useEffect, useState } from 'react';
import InfoScreen from '../widgets/InfoScreen';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gql } from './../gql';
import { useMutation } from '@apollo/client';
import useModal from '../hooks/useModal';
import IFrame from '../components/IFrame';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AsNavigationItem from '../components/AsNavigationItem';
import Hello from '../widgets/Hello';
import AlertMessage from '../widgets/AlertMessage';
import { useUserType } from '../hooks/useApollo';
import NotificationAlert from '../components/notifications/NotificationAlert';

type MentorCategory = 'LANGUAGE' | 'SUBJECTS' | 'DIDACTIC' | 'TECH' | 'SELFORGA' | 'OTHER';

const HelpCenter: React.FC = () => {
    const userType = useUserType();
    const { space, sizes } = useTheme();
    const [dsgvo, setDSGVO] = useState<boolean>(false);
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const [messageSent, setMessageSent] = useState<boolean>();
    const [showError, setShowError] = useState<boolean>();

    const { show, hide } = useModal();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [contactSupport, { data }] = useMutation(
        gql(`
        mutation ContactSupport($subject: String! $message: String!) { 
	        userContactSupport(message: { subject: $subject message: $message })
        }
    `)
    );

    const sendContactMessage = useCallback(async () => {
        const res = await contactSupport({
            variables: {
                subject,
                message,
            },
        });

        if (res.data?.userContactSupport) {
            setMessageSent(true);
        } else {
            setShowError(true);
        }
    }, [contactSupport, message, subject]);

    useEffect(() => {
        if (data) {
            show(
                { variant: 'light' },
                <InfoScreen
                    title={t('helpcenter.contact.popupTitle')}
                    icon={<InfoIcon />}
                    content={t('helpcenter.contact.popupContent')}
                    defaultButtonText={t('helpcenter.contact.popupBtn')}
                    defaultbuttonLink={() => {
                        hide();
                        navigate('/start');
                    }}
                />
            );
        }
    }, [data, show, hide, t, navigate]);

    // Breakpoints
    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const backArrow = useBreakpointValue({
        base: true,
        lg: false,
    });

    // const formControlWidth = useBreakpointValue({
    //   base: '100%',
    //   lg: sizes['containerWidth']
    // })

    const { trackEvent, trackPageView } = useMatomo();

    const onboardingCheck = useCallback(() => {
        navigate('/onboarding-list');

        trackEvent({
            category: 'hilfebereich',
            action: 'click-event',
            name: 'Hilebereich',
            documentTitle: 'Hilfebereich',
            href: '/onboarding-list',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    useEffect(() => {
        trackPageView({
            documentTitle: 'Hilfebereich',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AsNavigationItem path="hilfebereich">
            <WithNavigation headerTitle="Hilfebereich" headerContent={<Hello />} headerLeft={<NotificationAlert />}>
                <Box maxWidth={ContainerWidth} width="100%" marginX="auto">
                    <Box maxWidth={ContentContainerWidth} paddingBottom={space['1.5']} paddingX={space['1.5']}>
                        <Heading paddingBottom={1.5}>{t('helpcenter.title')}</Heading>
                        <Text>{t('helpcenter.subtitle')}</Text>
                    </Box>
                    {/* <Box
            maxWidth={ContentContainerWidth}
            paddingBottom={space['2.5']}
            paddingX={space['1.5']}>
            <Heading paddingBottom={space['0.5']}>
              {t('helpcenter.onboarding.title')}
            </Heading>
            <Text paddingBottom={space['1.5']}>
              {t('helpcenter.onboarding.content')}
            </Text>
            <Button width={buttonWidth} onPress={() => onboardingCheck()}>
              {t('helpcenter.onboarding.button')}
            </Button>
          </Box> */}
                </Box>
                <Box width="100%" maxWidth={ContainerWidth} marginX="auto">
                    <Tabs
                        tabInset={space['1.5']}
                        tabs={[
                            {
                                hide: userType === 'student',
                                title: t('helpcenter.faq.tabName'),
                                content: <IFrame src="https://www.lern-fair.de/iframe/faq-sus" title="faq" width="100%" height="596px" />,
                            },
                            {
                                hide: userType === 'pupil',
                                title: t('helpcenter.faq.tabName'),
                                content: <IFrame src="https://www.lern-fair.de/iframe/faq-huh" title="faq" width="100%" height="596px" />,
                            },
                            {
                                hide: userType === 'pupil',
                                title: t('helpcenter.assistance.title'),
                                content: <IFrame src="https://www.lern-fair.de/iframe/hilfestellungen" title="hilfestellungen" width="100%" height="596px" />,
                            },
                            {
                                title: t('helpcenter.contact.tabName'),
                                content: (
                                    <View paddingLeft={space['1.5']}>
                                        <Heading paddingBottom={space['0.5']}>{t('helpcenter.contact.title')}</Heading>
                                        <Text paddingBottom={space['1.5']}>{t('helpcenter.contact.content')}</Text>

                                        <FormControl maxWidth={ContentContainerWidth}>
                                            <Row flexDirection="column" paddingY={space['0.5']}>
                                                <FormControl.Label>{t('helpcenter.contact.subject.label')}</FormControl.Label>
                                                <Input onChangeText={setSubject} />
                                            </Row>
                                            <Row flexDirection="column" paddingY={space['0.5']}>
                                                <FormControl.Label>{t('helpcenter.contact.message.label')}</FormControl.Label>
                                                <TextArea
                                                    onChangeText={setMessage}
                                                    h={20}
                                                    placeholder={t('helpcenter.contact.message.placeholder')}
                                                    autoCompleteType={{}}
                                                />
                                            </Row>
                                            <Row flexDirection="column" paddingY={space['1.5']}>
                                                <Checkbox value="dsgvo" onChange={(val) => setDSGVO(val)}>
                                                    <Text>
                                                        Ich habe die <Link onPress={() => window.open('/datenschutz', '_blank')}>Datenschutzbestimmungen</Link>{' '}
                                                        zur Kenntnis genommen und bin damit einverstanden, dass meine persönlichen Daten entsprechend des
                                                        Zwecks, Umfangs und der Dauer wie in der Datenschutzerklärung angegeben, verarbeitet und gespeichert
                                                        werden. Ich nehme zur Kenntnis, dass die Verarbeitung meiner personenbezogenen Daten über die in den USA
                                                        sitzenden Auftragsverarbeitern Google und Zapier stattfindet, die die Einhaltung des europäischen
                                                        Datenschutzniveaus aufgrund der Möglichkeit von Anfragen von US-Nachrichtendiensten nicht gewährleisten
                                                        können. Zu diesem Zweck hat Lern-Fair Standardvertragsklauseln abgeschlossen und weitergehende
                                                        Sicherheitsmaßnahmen vereinbart, Art. 46 Abs. 2 lit. c DSGVO. Alternativ ist eine Kontaktierung per
                                                        E-Mail an
                                                        <Link
                                                            onPress={() =>
                                                                (window.location.href = 'mailto:mentoring@lern-fair.de?subject=Kontakt%20Userbereich')
                                                            }
                                                        >
                                                            {' '}
                                                            mentoring@lern-fair.de
                                                        </Link>{' '}
                                                        möglich.{' '}
                                                    </Text>
                                                </Checkbox>
                                            </Row>
                                            <Row flexDirection="column" paddingY={space['0.5']}>
                                                {messageSent && <AlertMessage content={t('helpcenter.contact.success')} />}
                                                {showError && <AlertMessage content={t('helpcenter.contact.error')} />}
                                                <Button
                                                    marginX="auto"
                                                    width={buttonWidth}
                                                    isDisabled={!dsgvo || message?.length < 5 || subject?.length < 5}
                                                    onPress={sendContactMessage}
                                                >
                                                    {t('helpcenter.btn.formsubmit')}
                                                </Button>
                                            </Row>
                                        </FormControl>
                                    </View>
                                ),
                            },
                        ]}
                    />
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default HelpCenter;
