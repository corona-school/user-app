import { Box, Button, Stack, useBreakpointValue, Text } from 'native-base';
import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
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

    const appointments = useMemo(() => {
        return (isCourse ? courseData?.subcourse?.appointments : matchData?.match?.appointments) ?? [];
    }, [courseData?.subcourse?.appointments, isCourse, matchData?.match?.appointments]);

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
    }, [appointments, setAppointmentsTotal, setOverrideMeetingLink]);

    useEffect(() => {
        isCourse ? refetchCourseAppointments() : refetchMatchAppointments();
    }, [isCourse, refetchCourseAppointments, refetchMatchAppointments]);

    return (
        <Box flex={1}>
            {(loadingCourseAppointments || loadingMatchAppointments) && <CenterLoadingSpinner />}
            {isCourse ? (
                <Box py={4}>
                    <Text>{t('appointment.create.insightCourseHeader', { courseTitle: courseData?.subcourse?.course?.name })}</Text>
                </Box>
            ) : (
                <Stack direction="row" py={4}>
                    <Text>
                        {t('appointment.create.insightMatchHeader', {
                            matchPartner: `${matchData?.match?.pupil?.firstname} ${matchData?.match?.pupil?.lastname}`,
                        })}
                    </Text>
                </Stack>
            )}
            <Box flex={1} display="flex" justifyContent="space-between">
                {(!errorCourseAppointments || errorMatchAppointments) && (
                    <div className="max-h-[400px] h-full overflow-y-auto mb-8">
                        <AppointmentList
                            height="100%"
                            noOldAppointments
                            isReadOnlyList={true}
                            appointments={appointments as Appointment[]}
                            clickable={true}
                            editable={false}
                            exhaustive={false}
                        />
                    </div>
                )}
                <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3}>
                    <Button variant="outline" onPress={back} width={buttonWidth}>
                        {t('appointment.create.backButton')}
                    </Button>
                    <Button onPress={next} width={buttonWidth}>
                        {t('appointment.create.addAppointmentButton')}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default AppointmentsInsight;
