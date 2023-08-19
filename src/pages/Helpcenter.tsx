import {
    Box,
    Heading,
    useTheme,
    Text,
    Link,
    Row,
    FormControl,
    TextArea,
    Checkbox,
    Button,
    InfoIcon,
    useBreakpointValue,
    View,
    Input,
    Stack,
} from 'native-base';
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
import HelpNavigation from '../components/HelpNavigation';
import { SwitchUserType } from '../User';
import ContactSupportForm from '../components/ContactSupportForm';

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
            <WithNavigation
                headerTitle="Hilfebereich"
                headerContent={<Hello />}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                <Box maxWidth={ContainerWidth} width="100%" marginX="auto">
                    <Box maxWidth={ContentContainerWidth} paddingBottom={space['1.5']} paddingX={space['1.5']}>
                        <Heading paddingBottom={1.5}>{t('helpcenter.title')}</Heading>
                        <SwitchUserType
                            pupilComponent={<Text>{t('helpcenter.subtitle.pupil')}</Text>}
                            studentComponent={<Text>{t('helpcenter.subtitle.student')}</Text>}
                        />
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
                                content: <ContactSupportForm />,
                            },
                        ]}
                    />
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default HelpCenter;
