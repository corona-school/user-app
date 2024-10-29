import { Button, Text, Heading, useTheme, VStack, Stagger, useBreakpointValue, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import WithNavigation from '../components/WithNavigation';
import CTACard from '../widgets/CTACard';

import IconApp from '../assets/icons/lernfair/onboarding/lf-onboarding-app.svg';
import IconContact from '../assets/icons/lernfair/onboarding/lf-onboarding-contact.svg';
import IconGroup from '../assets/icons/lernfair/onboarding/lf-onboarding-group.svg';
import IconHelp from '../assets/icons/lernfair/onboarding/lf-onboarding-help.svg';
import IconCalender from '../assets/icons/lernfair/onboarding/lf-onboarding-calender.svg';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useEffect } from 'react';
import CSSWrapper from '../components/CSSWrapper';
import NotificationAlert from '../components/notifications/NotificationAlert';
import SwitchLanguageButton from '../components/SwitchLanguageButton';

type Props = {};

const OnboardingTourList: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Onboarding Tour List',
        });
    }, []);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    return (
        <WithNavigation
            headerTitle={t('onboardingList.header')}
            showBack
            headerLeft={
                <Stack alignItems="center" direction="row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </Stack>
            }
        >
            <VStack marginX="auto" maxWidth={ContainerWidth} width="100%" paddingBottom={7} paddingX={space['1.5']}>
                <Heading paddingBottom={space['0.5']}>{t('onboardingList.title')}</Heading>
                <Text maxWidth={ContentContainerWidth}>{t('onboardingList.content')}</Text>
            </VStack>
            <VStack paddingX={space['1.5']} paddingBottom={space['2']} maxWidth={ContainerWidth} marginX="auto" width="100%">
                <Stagger
                    initial={{ opacity: 0, translateY: 20 }}
                    animate={{
                        opacity: 1,
                        translateY: 0,
                        transition: { stagger: { offset: 60 }, duration: 500 },
                    }}
                    visible
                >
                    <CSSWrapper className="onboarding__wrapper">
                        {new Array(5).fill(0).map(({}, index) => (
                            <CSSWrapper className="onboarding__item">
                                <CTACard
                                    className="h-full mb-2"
                                    key={`card-${index}`}
                                    title={t(`onboardingList.cards.card${index}.title` as unknown as TemplateStringsArray)}
                                    button={
                                        <Button
                                            onPress={() => {
                                                trackEvent({
                                                    category: 'onboarding',
                                                    action: 'click-event',
                                                    name:
                                                        'Button-Klick Onboarding' +
                                                        t(`onboardingList.cards.card${index}.title` as unknown as TemplateStringsArray),
                                                    documentTitle: t(`onboardingList.cards.card${index}.title` as unknown as TemplateStringsArray),
                                                });
                                                navigate(t(`onboardingList.cards.card${index}.url` as unknown as TemplateStringsArray));
                                            }}
                                        >
                                            {t(`onboardingList.buttontext`)}
                                        </Button>
                                    }
                                    icon={
                                        index === 0 ? (
                                            <IconApp />
                                        ) : index === 1 ? (
                                            <IconContact />
                                        ) : index === 2 ? (
                                            <IconGroup />
                                        ) : index === 3 ? (
                                            <IconHelp />
                                        ) : index === 4 ? (
                                            <IconCalender />
                                        ) : (
                                            ''
                                        )
                                    }
                                >
                                    <Text>{t(`onboardingList.cards.card${index}.content` as unknown as TemplateStringsArray)}</Text>
                                </CTACard>
                            </CSSWrapper>
                        ))}
                    </CSSWrapper>
                </Stagger>
            </VStack>
        </WithNavigation>
    );
};
export default OnboardingTourList;
