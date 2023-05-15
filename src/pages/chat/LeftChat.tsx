// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Heading, Stack, Text, useBreakpointValue, useTheme, View } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PartyIcon from '../../assets/icons/lernfair/lf-party.svg';

const getAppointmentOrganizer = gql(`
query appointmentOrganizer($appointmentId: Float!) {
    appointment(appointmentId: $appointmentId) {
        isOrganizer
        zoomMeetingId
    }
}`);

const LeftChat: React.FC = () => {
    const { id, type } = useParams();
    const idAsInt = parseInt(id!);

    const { data } = useQuery(getAppointmentOrganizer, { variables: { appointmentId: idAsInt } });
    const isOrganizer = data?.appointment.isOrganizer;

    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });
    const buttonWidth = useBreakpointValue({
        base: '100%',
        md: '300px',
    });
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { space } = useTheme();

    const chatType = type ? 'course' : 'oneOnOne';

    const [saveMeetingReport] = useMutation(
        gql(`
        mutation saveMeetingReport($appointmentId: Float!) {
            saveMeetingReport(appointmentId: $appointmentId)
        }
    `)
    );

    const saveAndFinish = async () => {
        console.log('save and finish');
        if (isOrganizer) {
            await saveMeetingReport({ variables: { appointmentId: idAsInt } });
        }
        navigate('/');
    };

    return (
        <View position="fixed" top="0" left="0" right="0" w="100vw" h="100vh" background="primary.900">
            <Stack w={width} h="inherit" padding="24px" flex={1} space={space['1']} direction="column" justifyContent="center">
                <Box alignSelf="center">
                    <PartyIcon />
                </Box>
                <Stack space={space['1']} direction="column">
                    <Heading fontWeight="700" lineHeight="md" fontSize="lg" color="white" textAlign="center">
                        {t(`chat.${chatType}.leftChat.title`)}
                    </Heading>
                    <Text fontWeight="normal" fontSize="xs" color="white" textAlign="center">
                        {t(`chat.${chatType}.leftChat.subtitle`)}
                    </Text>
                </Stack>
                <Button alignSelf="center" width={buttonWidth} onPress={() => saveAndFinish()}>
                    <Text fontSize="sm">{t(`chat.${chatType}.leftChat.button`)}</Text>
                </Button>
            </Stack>
        </View>
    );
};

export default LeftChat;
