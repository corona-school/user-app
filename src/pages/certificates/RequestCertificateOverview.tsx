import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Text, VStack, Heading, useTheme, Box, Button } from 'native-base';
import { useEffect } from 'react';

type Props = {
    onNext: () => any;
    onBack: () => any;
};

const RequestCertificateOverview: React.FC<Props> = ({ onNext, onBack }) => {
    const { space, colors } = useTheme();
    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Zertifikate anfordern – Übersicht',
        });
    }, []);

    return (
        <VStack space={space['1']}>
            <Heading>Bescheinigung beantragen</Heading>
            <Text>Wir möchten uns für dein Engagement bei Lern-Fair bedanken! Für deine Tätigkeit stellen wir dir gerne eine Bescheinigung aus.</Text>
            <Text>Eine vollständige Lern Fair Bescheinigung besteht aus den folgenden zwei Teilen:</Text>

            <VStack space={space['0.5']}>
                <Box bgColor={colors['primary']['100']} padding={space['1']} borderRadius={4}>
                    <Text bold mb={space['0.5']}>
                        1. Bestätigung durch Lern-Fair
                    </Text>
                    <Text>· Registrieren auf unserer Plattform</Text>
                    <Text>· Durchlaufen eines Eignungsgesprächs</Text>
                    <Text>· Vermittlung an eine:n Schüler:in</Text>
                </Box>
                <Box bgColor={colors['primary']['100']} padding={space['1']} borderRadius={4}>
                    <Text bold mb={space['0.5']}>
                        2. Bestätigung durch Schüler:in
                    </Text>
                    <Text>· Ausmaß der Tätigkeit</Text>
                    <Text>· Inhalte der Tätigkeit</Text>
                </Box>
            </VStack>
            <Text>
                Du kannst die Bescheinigung hier beantragen und erhältst eine Benachrichtigung, sobald dein Engagement von deinem:r Schüler:in bestätigt wurde.
                Ab dann findest du die Bescheinigung auch in deinem Profil.
            </Text>
            <Button onPress={onNext}>Vollständige Bescheinigung beantragen</Button>
            <Text>
                Falls du ausschließlich eine Bestätigung von Lern Fair erhalten möchtest, die keine Informationen zum Ausmaß oder den Inhalten der Tätigkeit
                enthält, kannst du dies hier tun.
            </Text>

            <Button variant="link" onPress={onBack}>
                Zurück
            </Button>
        </VStack>
    );
};
export default RequestCertificateOverview;
