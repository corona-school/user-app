import { useEffect, useRef, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Container, Flex, useTheme, Box, Text, Row, Heading, View, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';

type Props = {};

const OnboardingNew: React.FC<Props> = () => {
    const { space } = useTheme();

    const { t } = useTranslation();

    const video = 'YCWwiSwg6OM';
    const videoMobile = 'LKjKYLXBrU0';
    const paddingVidBox = space['1'];

    const [videoHeight, setVideoHeight] = useState(400);
    const [isVertival, setIsVertical] = useState(window.innerHeight > window.innerWidth);

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
        <Container backgroundColor="primary.100" maxWidth="100%" height="100%" overflowY="scroll" alignItems="stretch">
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
                    width={(videoHeight - 8 * paddingVidBox) * (isVertival ? 9 / 16 : 16 / 9) + 8 * paddingVidBox}
                    maxWidth={window.innerWidth - paddingVidBox * 8}
                >
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${
                            isVertival ? videoMobile : video
                        }`} /* TBD: Datenschutzbanner für YouTube ODER Videos selbst hosten */
                        allow="encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Onboarding Video"
                        style={{
                            border: 'none',
                        }}
                    />
                </Box>
                {/* FOOTER */}
                <Box backgroundColor="primary.700" ref={footerRef}>
                    <Text
                        color="lightText"
                        fontWeight="700"
                        textAlign="center"
                        py={space['1']}
                        onPress={() => window.open('https://calendly.com/lern-fair/huh-kennenlernen')} /* TBD: Datenschutzinformationen einblenden */
                    >
                        {t('onboarding.student.button')}
                    </Text>
                </Box>
            </Flex>
        </Container>
    );
};

export default OnboardingNew;
