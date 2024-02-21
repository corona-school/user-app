import { useEffect, useRef, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Container, Flex, useTheme, Box, Text, Row, Heading, View, useBreakpointValue } from 'native-base';

type Props = {};

const OnboardingNew: React.FC<Props> = () => {
    const { space, sizes } = useTheme();

    const [heightHeader, setHeight] = useState(0);
    const [heightFooter, setHeightF] = useState(0);

    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (headerRef.current !== null) {
            setHeight(headerRef.current.clientHeight);
        }
    }, [headerRef.current?.clientHeight]);

    useEffect(() => {
        if (footerRef.current !== null) {
            setHeightF(footerRef.current.clientHeight);
        }
    }, [footerRef.current?.clientHeight]);

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

    const videoSize = useBreakpointValue({
        /* base: {
            width: 576,
            height: 324,
        }, */
        lg: {
            //*1.5
            width: 864,
            height: 486,
        },
        /* xl: {
            //*1.7
            width: 979.2,
            height: 550.8,
        }, */
        /* '2xl': {
            //*2
            width: 1152,
            height: 648,
        }, */
    });

    //TEMPORARY
    const video = 'YCWwiSwg6OM'; //web
    //const video = "LKjKYLXBrU0"; //mobile
    //const video = "dQw4w9WgXcQ"; //;)

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
                                Willkommen bei Lern-Fair!
                            </Heading>
                            <Text color="lightText" textAlign="center" maxWidth={contentWidth} paddingBottom={space['1']}>
                                Danke für deine Registrierung! In einem nächsten Schritt laden wir dich zu einem digitalen Kennenlerngespräch mit uns ein.
                            </Text>
                        </Row>
                    </View>
                </Box>
                {/* VIDEO */}
                <Box
                    borderRadius="md"
                    bg="primary.400"
                    alignSelf="center"
                    p={space['1']}
                    my={space['1']}
                    height={window.innerHeight - heightHeader - heightFooter - space['1'] * 8 /* videoSize.height */}
                    width={'864px' /* videoSize.width - space['1'] * 6.2 */} //please don't ask me why 6.2, in theory it should be 2...
                    maxWidth={window.innerWidth - space['1'] * 8}
                    maxHeight={window.innerHeight - heightHeader - heightFooter - space['1'] * 8}
                >
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video}`} /* TBD: Datenschutzbanner für YouTube ODER Videos selbst hosten */
                        /* allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" */
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
                        Kennenlerngespräch buchen
                    </Text>
                </Box>
            </Flex>
        </Container>
    );
};

export default OnboardingNew;
