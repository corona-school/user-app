import { Box, Button, Stack, useBreakpointValue, Text, ScrollView } from 'native-base';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AppointmentList from '../../widgets/appointment/AppointmentList';
type Props = {
    id: number;
    isCourse: boolean;
    next: () => void;
    back: () => void;
    setAppointmentsTotal: Dispatch<SetStateAction<number>>;
};

const GET_COURSE_APPOINTMENTS = gql`
    query subcourseAppointments($id: Int!) {
        subcourse(subcourseId: $id) {
            course {
                name
            }
            appointments {
                id
                start
                duration
                title
                description
                position
                total
                organizers(skip: 0, take: 10) {
                    firstname
                    lastname
                }
                participants(skip: 0, take: 50) {
                    firstname
                    lastname
                }
            }
        }
    }
`;

const GET_MATCH_APPOINTMENTS = gql`
    query matchAppointments($id: Int!) {
        match(matchId: $id) {
            pupil {
                id
                firstname
                lastname
            }
            appointments {
                id
                start
                duration
                title
                description
                appointmentType
                meetingLink
                isCanceled
                subcourseId
                matchId
                position
                total
                participants(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                }
                organizers(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                }
                isOrganizer
                isParticipant
                declinedBy(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                    isStudent
                    isPupil
                }
            }
        }
    }
`;

const AppointmentsInsight: React.FC<Props> = ({ id, next, back, isCourse, setAppointmentsTotal }) => {
    const { data, loading, error } = useQuery(isCourse ? GET_COURSE_APPOINTMENTS : GET_MATCH_APPOINTMENTS, { variables: { id } });
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '25%',
    });

    useEffect(() => {
        isCourse ? setAppointmentsTotal(data?.subcourse?.appointments?.length) : setAppointmentsTotal(data?.match?.appointments?.length);
    });
    return (
        <Box>
            {loading && <CenterLoadingSpinner />}
            {isCourse ? (
                <Box py={6}>
                    <Text>{t('appointment.create.insightCourseHeader', { courseTitle: data?.subcourse?.course?.name })}</Text>
                </Box>
            ) : (
                <Stack direction="row" py={6}>
                    <Text>
                        {t('appointment.create.insightMatchHeader', { matchPartner: `${data?.match?.pupil?.firstname} ${data?.match?.pupil?.lastname}` })}
                    </Text>
                </Stack>
            )}
            {!error && (
                <Box maxH={maxHeight} flex="1" mb="10">
                    <AppointmentList isReadOnly={true} appointments={isCourse ? data?.subcourse?.appointments : data?.match?.appointments} />
                </Box>
            )}
            <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3}>
                <Button onPress={next} width={buttonWidth}>
                    {t('appointment.create.addAppointmentButton')}
                </Button>
                <Button variant="outline" onPress={back} width={buttonWidth}>
                    {t('appointment.create.backButton')}
                </Button>
            </Stack>
        </Box>
    );
};

export default AppointmentsInsight;
