import { Box, Heading, useTheme, Text, InfoIcon, useBreakpointValue, Stack } from 'native-base';
import NavigationTabs from '../components/NavigationTabs';
import WithNavigation from '../components/WithNavigation';
import { useEffect } from 'react';
import InfoScreen from '../widgets/InfoScreen';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gql } from './../gql';
import { useMutation } from '@apollo/client';
import useModal from '../hooks/useModal';
import IFrame from '../components/IFrame';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AsNavigationItem from '../components/AsNavigationItem';
import { useUserType } from '../hooks/useApollo';
import NotificationAlert from '../components/notifications/NotificationAlert';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import { SwitchUserType } from '../User';
import ContactSupportForm from '../components/ContactSupportForm';

const HelpCenter: React.FC = () => {
    const userType = useUserType();
    const { space, sizes } = useTheme();

    const { show, hide } = useModal();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [, { data }] = useMutation(
        gql(`
        mutation ContactSupport($subject: String! $message: String!) { 
	        userContactSupport(message: { subject: $subject message: $message })
        }
    `)
    );

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

    const isMobileSM = useBreakpointValue({
        base: true,
        sm: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { trackEvent, trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Hilfebereich',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AsNavigationItem path="hilfebereich">
            <WithNavigation
                showBack={isMobileSM ? true : false}
                hideMenu={isMobileSM ? true : false}
                previousFallbackRoute="/settings"
                headerTitle="Hilfebereich"
                headerLeft={
                    !isMobileSM && (
                        <Stack alignItems="center" direction="row">
                            <SwitchLanguageButton />
                            <NotificationAlert />
                        </Stack>
                    )
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
                </Box>
                <Box width="100%" maxWidth={ContainerWidth} marginX="auto" flex={1}>
                    <NavigationTabs
                        removeSpace
                        tabs={[
                            {
                                hide: userType === 'student',
                                title: t('helpcenter.faq.tabName'),
                                content: <IFrame src="https://www.lern-fair.de/iframe/faq-sus" title="faq" width="100%" />,
                            },
                            {
                                hide: userType === 'pupil',
                                title: t('helpcenter.faq.tabName'),
                                content: <IFrame src="https://www.lern-fair.de/iframe/faq-huh" title="faq" width="100%" />,
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
