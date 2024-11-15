import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { View, Container, Text, Center, Heading, Row } from 'native-base';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ViewPager from '../../../components/ViewPager';
import OnboardingView from '../../../widgets/OnboardingView';
import { Checkbox } from '@/components/Checkbox';

type Props = {};

function Page({ screenIndex }: { screenIndex: number }): JSX.Element {
    const { t } = useTranslation();

    /* TBD: Reset Scroll Position on new Page */
    return (
        <Center mx={4} mb={60}>
            <Heading textAlign="center" color="primary.1000">
                {t(`onboardingList.Wizard.ethics.screen${screenIndex}.header1` as unknown as TemplateStringsArray)}
            </Heading>
            <Text fontSize="lg" color="primary.1000" textAlign="center" py={2}>
                {t(`onboardingList.Wizard.ethics.screen${screenIndex}.content1` as unknown as TemplateStringsArray)}
            </Text>

            <Heading textAlign="center" color="primary.1000">
                {t(`onboardingList.Wizard.ethics.screen${screenIndex}.header2` as unknown as TemplateStringsArray)}
            </Heading>
            <Text fontSize="lg" color="primary.1000" textAlign="center" py={2}>
                {t(`onboardingList.Wizard.ethics.screen${screenIndex}.content2` as unknown as TemplateStringsArray)}
            </Text>
        </Center>
    );
}

const OnBoardingStudentSlides: React.FC<Props> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { trackPageView } = useMatomo();

    /* TBD: Hier auf Namen für documentTitle einigen */
    useEffect(() => {
        trackPageView({
            documentTitle: 'Ethische Standards Onboarding Slider',
        });
    }, []);

    return (
        <Container backgroundColor="primary.100" maxWidth="100%" height="100%" overflowY="scroll" alignItems="stretch">
            <View flex={1}>
                {/* TBD: Clarify whether screens with multiple paragraphs should have a genereal 'h1' title above (to keep it consistent) */}
                <ViewPager onPrev={(i) => (i === 0 ? navigate('onboarding/ethics/welcome') : undefined)} hideNextOnLast>
                    <OnboardingView title={t('onboardingList.Wizard.ethics.screen1.title')} alternativeContent={<Page screenIndex={1} />} />
                    <OnboardingView title={t('onboardingList.Wizard.ethics.screen2.title')} alternativeContent={<Page screenIndex={2} />} />
                    <OnboardingView title={t('onboardingList.Wizard.ethics.screen3.title')} alternativeContent={<Page screenIndex={3} />} />
                    <OnboardingView title={t('onboardingList.Wizard.ethics.screen4.title')} alternativeContent={<Page screenIndex={4} />} />
                    <OnboardingView
                        title={t('onboardingList.Wizard.ethics.screen5.title')}
                        alternativeContent={
                            <>
                                <Text fontSize="lg" color="primary.1000" textAlign="center" py={2} mx={4}>
                                    {t(`onboardingList.Wizard.ethics.screen5.content1`)}
                                </Text>
                                <Row space={2} justifyContent="center" alignItems="center" m={4} mb={60}>
                                    <Checkbox onCheckedChange={() => alert('u just got checked 😎')} />
                                    <Text fontSize="lg" color="primary.1000">
                                        {t('onboardingList.Wizard.ethics.screen5.checkboxText')}
                                    </Text>
                                </Row>
                            </>
                        }
                    />
                </ViewPager>
            </View>
        </Container>
    );
};
export default OnBoardingStudentSlides;
