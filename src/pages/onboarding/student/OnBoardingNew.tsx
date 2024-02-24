import { useEffect, useRef, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Container, Flex, useTheme, Box, Text, Row, Heading, View, useBreakpointValue, Link, Button, Card, ScrollView } from 'native-base';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../../../modals/ConfirmModal';
import CenterLoadingSpinner from '../../../components/CenterLoadingSpinner';

type Props = {};

//TBD: How should this page be skipped / finished and to what page should they lead the user afterwards?
//TBD: Add proper text to youtube privacy banner
const OnboardingNew: React.FC<Props> = () => {
    const { space } = useTheme();

    const { t } = useTranslation();

    const video = 'YCWwiSwg6OM';
    const videoMobile = 'LKjKYLXBrU0';
    const paddingVidBox = space['1'];

    const [videoHeight, setVideoHeight] = useState(400);
    const [isVertical, setIsVertical] = useState(window.innerHeight > window.innerWidth);
    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
    const [agreedYoutubePrivacy, setAgreedYoutubePrivacy] = useState(false);
    const [isIframeLoading, setIsIframeLoading] = useState(true);

    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setVideoHeight(window.innerHeight - paddingVidBox * 8 - (headerRef.current?.clientHeight ?? 0) - (footerRef.current?.clientHeight ?? 0));
    }, [headerRef.current?.clientHeight, footerRef.current?.clientHeight, window.innerHeight]);

    useEffect(() => {
        setIsVertical(window.innerHeight > window.innerWidth);
    }, [window.innerHeight, window.innerWidth]);

    /* // TBD: Adding Tracking for this new Page
    const { trackPageView } = useMatomo();
    
    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Onboarding',
        });
    }, []); */

    const contentWidth = useBreakpointValue({
        base: '300px',
        lg: '570px',
    });

    return (
        <ScrollView>
            <Container backgroundColor="primary.100" maxWidth="100%" overflowY="scroll" alignItems="stretch">
                <Flex justifyContent="space-between" height="100%">
                    {/* HEADER */}
                    <Box width="100%" ref={headerRef}>
                        <View
                            paddingX={space['1']}
                            paddingBottom={space['1']}
                            color="lightText"
                            alignItems="center"
                            borderBottomRadius="15px"
                            backgroundColor="primary.800"
                        >
                            <Row flexDirection="column">
                                <Heading fontSize="xl" color="lightText" textAlign="center" paddingY={space['1']} maxWidth={contentWidth}>
                                    {t('onboarding.student.header')}
                                </Heading>
                                <Text color="lightText" textAlign="center" maxWidth={contentWidth} paddingBottom={space['1']}>
                                    {t('onboarding.student.text')}
                                </Text>
                            </Row>
                        </View>
                    </Box>
                    {/* VIDEO */}
                    <Box
                        borderRadius="md"
                        bg="primary.400"
                        alignSelf="center"
                        p={paddingVidBox}
                        my={space['1']}
                        height={videoHeight}
                        width={(videoHeight - 8 * paddingVidBox) * (isVertical ? 9 / 16 : 16 / 9) + 8 * paddingVidBox}
                        maxWidth={window.innerWidth - paddingVidBox * 8}
                        minHeight={isVertical ? 400 : 239}
                        minWidth={isVertical ? 239 : 400}
                    >
                        {!agreedYoutubePrivacy ? (
                            <Flex justifyContent="center" alignItems="center" height="100%">
                                <Card p={space['2']} bg="primary.100" alignSelf="center" maxHeight="100%" maxWidth="100%">
                                    <Text textAlign="center">
                                        {
                                            'Youtube klaut deine Daten! Möchtest du das wirklich? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n '
                                        }
                                    </Text>
                                    <Button onPress={() => setAgreedYoutubePrivacy(true)} minWidth="100px" minHeight="40px">
                                        Ja, ich will!
                                    </Button>
                                </Card>
                            </Flex>
                        ) : (
                            <>
                                {isIframeLoading && <CenterLoadingSpinner color="primary.100" />}
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${isVertical ? videoMobile : video}`}
                                    allow="encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Onboarding Video"
                                    style={{
                                        border: 'none',
                                    }}
                                    loading="lazy"
                                    onLoad={() => setIsIframeLoading(false)}
                                />
                            </>
                        )}
                    </Box>
                    {/* FOOTER */}
                    <Box backgroundColor="primary.700" ref={footerRef}>
                        <Text color="lightText" fontWeight="700" textAlign="center" py={space['1']} onPress={() => setShowCalendlyModal(true)}>
                            {t('onboarding.student.button')}
                        </Text>
                    </Box>
                </Flex>
                <ConfirmModal
                    text=""
                    isOpen={showCalendlyModal}
                    onConfirmed={() => window.open('https://calendly.com/lern-fair/huh-kennenlernen')}
                    onClose={() => setShowCalendlyModal(false)}
                    danger={false}
                >
                    <Text textAlign="center">
                        {
                            'Mit dem folgenden Link wirst du zu unserem in den USA sitzenden Dienstleister Calendly weitergeleitet.\nWeitere Informationen zur Datenverarbeitung bei Calendly findest du '
                        }
                        <Link onPress={() => window.open('https://calendly.com/privacy')}>hier</Link>.{'\n\nMöchtest du fortfahren?'}
                    </Text>
                </ConfirmModal>
            </Container>
        </ScrollView>
    );
};

export default OnboardingNew;
