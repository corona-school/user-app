import { Box, Button, Circle, HStack, Heading, Stack, Text, Tooltip } from 'native-base';
import WithNavigation from '../components/WithNavigation';
import HelpNavigation from '../components/HelpNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { gql } from '../gql';
import { useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import AlertMessage from '../widgets/AlertMessage';
import { Trans, useTranslation } from 'react-i18next';
import useApollo from '../hooks/useApollo';
import { BACKEND_URL } from '../config';

export const COC_DATE_QUERY = gql(`
query GetCocDate {
  me {
    student {
      certificateOfConductDeactivationDate
    }
}
}
`);

const CertificateOfConduct = () => {
    const { t } = useTranslation();
    const { user } = useApollo();
    const { data } = useQuery(COC_DATE_QUERY);
    const cocDate = data?.me?.student?.certificateOfConductDeactivationDate;

    const [downloadRemissionRequest] = useMutation(gql(`mutation DownloadRemissionRequest { studentGetRemissionRequestAsPDF }`));

    async function openRemissionRequest() {
        const { data } = await downloadRemissionRequest();
        window.open(BACKEND_URL + data!.studentGetRemissionRequestAsPDF, '_blank');
    }

    return (
        <>
            <WithNavigation
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
                showBack
            >
                <Stack space={3}>
                    <Heading>{t('certificateOfConduct.header')}</Heading>
                    <Stack space={2} mb="3">
                        <Text>{t('certificateOfConduct.description')}</Text>
                        <HStack space={2}>
                            <Text>
                                <Trans>{t('certificateOfConduct.deadline', { cocDate: DateTime.fromISO(cocDate).toFormat('dd.MM.yyyy') })}</Trans>
                            </Text>
                            <Text></Text>
                            <Tooltip label={t('certificateOfConduct.tooltip')}>
                                <Circle rounded="full" bg="danger.100" size={4}>
                                    <Text color={'white'}>i</Text>
                                </Circle>
                            </Tooltip>
                        </HStack>
                        <AlertMessage content={<Trans>{t('certificateOfConduct.alert_message')}</Trans>} />
                    </Stack>
                    ´
                    <HStack space={4} mb="10">
                        <Button variant="outline" onPress={openRemissionRequest}>
                            {t('certificateOfConduct.download')}
                        </Button>
                        <Button
                            onPress={() =>
                                (window.location.href = `mailto:fz@lern-fair.de?subject=F%C3%BChrungszeugnis%3A%20${user?.firstname}%20${user?.lastname}&body=Liebes%20Lern-Fair%20Team%2C%0D%0A%0D%0Aanbei%20finet%20ihr%20das%20erweiterte%20F%C3%BChrungszeugnis%2C%20welches%20ich%20gem%C3%A4%C3%9F%20der%20Anforderungen%20beantragt%20habe.%20Ich%20bedanke%20mich%20f%C3%BCr%20die%20Unterst%C3%BCtzung%20und%20freue%20mich%2C%20wenn%20ihr%20den%20Erhalt%20kurz%20best%C3%A4tigen%20k%C3%B6nnt.%0D%0A%0D%0ALiebe%20Gr%C3%BC%C3%9Fe%2C%0D%0A${user?.firstname}%0D%0A${user?.email}%0D%0A%0D%0A`)
                            }
                        >
                            {t('certificateOfConduct.upload')}
                        </Button>
                    </HStack>
                    <Heading fontSize="lg">{t('certificateOfConduct.request_header')}</Heading>
                    <HStack space={5}>
                        <Stack>
                            <Text>{t('certificateOfConduct.general_info')}</Text>
                            <Box maxW="600px">
                                <video controls muted controlsList="nodownload">
                                    <source src={process.env.PUBLIC_URL + '/videos/explain_coc.mp4'} type="video/mp4" />
                                </video>
                            </Box>
                        </Stack>
                        <Stack>
                            <Text>{t('certificateOfConduct.digital_request')}</Text>
                            <Box maxW="600px">
                                <video controls muted controlsList="nodownload">
                                    <source src={process.env.PUBLIC_URL + '/videos/explain_digital_coc.mp4'} type="video/mp4" />
                                </video>
                            </Box>
                        </Stack>
                    </HStack>
                </Stack>
            </WithNavigation>
        </>
    );
};

export default CertificateOfConduct;
