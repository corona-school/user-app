import { useEffect } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Container, Flex, useTheme, Box, Text } from 'native-base';
import OnboardingView from '../../../widgets/OnboardingView';

type Props = {};

const OnboardingNew: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    /* // TBD: Adding Tracking for this new Page
    const { trackPageView } = useMatomo();
    
    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Onboarding',
        });
    }, []); */

    return (
        <Container backgroundColor="primary.100" maxWidth="100%" height="100%" overflowY="scroll" alignItems="stretch">
            <Flex justifyContent="space-between" height="100%">
                <OnboardingView
                    title="Willkommen bei Lern-Fair!"
                    content="Danke für deine Registrierung! In einem nächsten Schritt laden wir dich zu einem digitalen Kennenlerngespräch mit uns ein. "
                    video="YCWwiSwg6OM"
                    videoMobile="LKjKYLXBrU0"
                />
                <Box backgroundColor="primary.700">
                    <Text
                        color="lightText"
                        fontWeight="700"
                        textAlign="center"
                        py="5"
                        onPress={() => window.open('https://calendly.com/lern-fair/huh-kennenlernen')} /* TBD: Für Calendly Datenschutzbanner notwendig? */
                    >
                        Kennenlerngespräch buchen
                    </Text>
                </Box>
            </Flex>
        </Container>
    );
};

export default OnboardingNew;
