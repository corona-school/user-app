import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { View, Container, Text, Center, Heading, Row } from 'native-base';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ViewPager from '../../../components/ViewPager';
import OnboardingView from '../../../widgets/OnboardingView';
import { Checkbox } from '@/components/Checkbox';

type Props = {};

function Page({ screenIndex, paragraphs }: { screenIndex: number; paragraphs: number }): JSX.Element {
    const { t } = useTranslation();

    /* TBD: Fix scrolling with Bottom Navbar above (Maybe with small arrow pointing down to clarify that user has to scroll) */
    return (
        <Center mx={4}>
            {[...Array(paragraphs)].map((v, i) => (
                <>
                    {paragraphs > 1 ? (
                        <Heading textAlign="center" color="primary.1000">
                            {t(`onboardingList.Wizard.ethics.screen${screenIndex}.header${i + 1}` as unknown as TemplateStringsArray)}
                        </Heading>
                    ) : (
                        <></>
                    )}

                    <Text fontSize="lg" color="primary.1000" textAlign="center" py={2}>
                        {t(`onboardingList.Wizard.ethics.screen${screenIndex}.content${i + 1}` as unknown as TemplateStringsArray)}
                    </Text>
                </>
            ))}
        </Center>
    );
}

/* TBD: Fix Back Button on Slide 1 not going to Onboarding Welcome Page
    Maybe change navigation to be via URL? Would have other benefits too...
*/
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
                <ViewPager onFinish={() => navigate('/onboarding/ethics/finish')}>
                    {/* SCREEN 1 */}
                    <OnboardingView title={t('onboardingList.Wizard.ethics.screen1.title')} alternativeContent={<Page screenIndex={1} paragraphs={2} />} />
                    {/* SCREEN 2 */}
                    <OnboardingView title={t('onboardingList.Wizard.ethics.screen2.title')} alternativeContent={<Page screenIndex={2} paragraphs={2} />} />
                    {/* SCREEN 3 */}
                    <OnboardingView title={t('onboardingList.Wizard.ethics.screen3.title')} alternativeContent={<Page screenIndex={3} paragraphs={2} />} />
                    {/* SCREEN 4 */}
                    <OnboardingView title={t('onboardingList.Wizard.ethics.screen4.title')} alternativeContent={<Page screenIndex={4} paragraphs={2} />} />
                    {/* SCREEN 5 */}
                    <OnboardingView
                        title={t('onboardingList.Wizard.ethics.screen5.title')}
                        alternativeContent={
                            <>
                                <Page screenIndex={5} paragraphs={1} />
                                <Row space={2} justifyContent="center" m={4}>
                                    <Checkbox />
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
