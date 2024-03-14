import { Box, Button, Stack, useBreakpointValue, Text } from 'native-base';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from './../../gql';
import { useQuery } from '@apollo/client';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AppointmentList from '../../widgets/AppointmentList';
import { Appointment } from '../../types/lernfair/Appointment';
type Props = {
    id: number;
    isCourse: boolean;
    next: () => void;
    back: () => void;
    setAppointmentsTotal: Dispatch<SetStateAction<number>>;
    setOverrideMeetingLink: Dispatch<SetStateAction<string | undefined>>;
};

const GET_COURSE_APPOINTMENTS = gql(`
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
                displayName
                position
                total
                appointmentType
                override_meeting_link
                participants(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                    isPupil
                    isStudent
                }
                organizers(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                }
            }
        }
    }
`);

const GET_MATCH_APPOINTMENTS = gql(`
    query matchAppointments($id: Int!) {
        match(matchId: $id) {
            pupil {
                id
                firstname
                lastname
            }
            appointments {
                id
                matchId
                start
                duration
                title
                description
                displayName
                position
                total
                appointmentType
                override_meeting_link
                participants(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                    isPupil
                    isStudent
                }
                organizers(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                }
            }
        }
    }
`);

const AppointmentsInsight: React.FC<Props> = ({ id, next, back, isCourse, setAppointmentsTotal, setOverrideMeetingLink }) => {
    const {
        data: courseData,
        loading: loadingCourseAppointments,
        error: errorCourseAppointments,
        refetch: refetchCourseAppointments,
    } = useQuery(GET_COURSE_APPOINTMENTS, { variables: { id }, skip: !isCourse });

    const {
        data: matchData,
        loading: loadingMatchAppointments,
        error: errorMatchAppointments,
        refetch: refetchMatchAppointments,
    } = useQuery(GET_MATCH_APPOINTMENTS, { variables: { id }, skip: isCourse });
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const appointments = (isCourse ? courseData?.subcourse?.appointments : matchData?.match?.appointments) ?? [];

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '25%',
    });

    useEffect(() => {
        const lastAppointment = appointments[appointments.length - 1];
        if (lastAppointment && lastAppointment.override_meeting_link) {
            setOverrideMeetingLink(lastAppointment.override_meeting_link);
        }
        setAppointmentsTotal(appointments.length);
        isCourse ? refetchCourseAppointments() : refetchMatchAppointments();
    }, [appointments, isCourse, refetchCourseAppointments, refetchMatchAppointments, setAppointmentsTotal, setOverrideMeetingLink]);

    return (
        <Box>
            {(loadingCourseAppointments || loadingMatchAppointments) && <CenterLoadingSpinner />}
            {isCourse ? (
                <Box py={6}>
                    <Text>{t('appointment.create.insightCourseHeader', { courseTitle: courseData?.subcourse?.course?.name })}</Text>
                </Box>
            ) : (
                <Stack direction="row" py={6}>
                    <Text>
                        {t('appointment.create.insightMatchHeader', {
                            matchPartner: `${matchData?.match?.pupil?.firstname} ${matchData?.match?.pupil?.lastname}`,
                        })}
                    </Text>
                </Stack>
            )}
            {(!errorCourseAppointments || errorMatchAppointments) && (
                <Box minH={isMobile ? 400 : 600} maxH={maxHeight} flex="1" mb="10">
                    <AppointmentList isReadOnlyList={true} appointments={appointments as Appointment[]} />
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
