import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Text, VStack, Heading, useTheme, Box, Button, HStack } from 'native-base';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    onNext: () => any;
    onBack: () => any;
};

const RequestCertificateOverview: React.FC<Props> = ({ onNext, onBack }) => {
    const { space, colors } = useTheme();
    const { trackPageView } = useMatomo();
    const { t } = useTranslation();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Zertifikate anfordern – Übersicht',
        });
    }, []);

    return (
        <VStack space={space['1']}>
            <Heading>{t('certificate.request.title')}</Heading>
            <Text>{t('certificate.request.subtitle')}</Text>
            <Text>{t('certificate.request.subtitle2')}</Text>

            <HStack space={space['0.5']} flexWrap="wrap">
                <Box bgColor={colors['primary']['100']} marginTop={space['1']} padding={space['1']} borderRadius={4} flexGrow="1">
                    <Text bold mb={space['0.5']}>
                        {t('certificate.request.part1_title')}
                    </Text>
                    <Text>· {t('certificate.request.part1_1')}</Text>
                    <Text>· {t('certificate.request.part1_2')}</Text>
                    <Text>· {t('certificate.request.part1_3')}</Text>
                </Box>
                <Box bgColor={colors['primary']['100']} marginTop={space['1']} padding={space['1']} borderRadius={4} flexGrow="1">
                    <Text bold mb={space['0.5']}>
                        {t('certificate.request.part2_title')}
                    </Text>
                    <Text>· {t('certificate.request.part2_1')}</Text>
                    <Text>· {t('certificate.request.part2_2')}</Text>
                </Box>
            </HStack>
            <Text>{t('certificate.request.procedure')}</Text>
            <Button onPress={onNext}>{t('certificate.request.apply')}</Button>

            <Button variant="link" onPress={onBack}>
                {t('back')}
            </Button>
        </VStack>
    );
};
export default RequestCertificateOverview;
