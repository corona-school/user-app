import { gql, useQuery } from '@apollo/client';
import { Box, Button, Divider, Modal, Stack, useBreakpointValue } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateCourseAppointments } from '../../context/AppointmentContext';
import { AppointmentType } from '../../gql/graphql';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import AppointmentsEmptyState from '../../widgets/AppointmentsEmptyState';
import CreateCourseAppointmentModal from './CreateCourseAppointmentModal';

type Props = {
    next: () => void;
    back: () => void;
};

const GET_COURSE_APPOINTMENTS = gql`
    query courseAppointments($id: Int!) {
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
                appointmentType
                meetingLink
                isCanceled
                subcourseId
                matchId
                participants(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                    isPupil
                }
                organizers(skip: 0, take: 10) {
                    id
                    firstname
                    lastname
                    isStudent
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

const CourseAppointments: React.FC<Props> = ({ next, back }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);

    const { appointmentsToBeCreated } = useCreateCourseAppointments();
    // TODO query on editing modus
    // const { data, loading, error, fetchMore } = useQuery(GET_COURSE_APPOINTMENTS, {variables: { id: 1 },});

    const { isMobile } = useLayoutHelper();

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    const _convertAppointments = () => {
        let convertedAppointments: Appointment[] = [];
        for (const appointment of appointmentsToBeCreated) {
            const converted = {
                id: 1,
                title: appointment.title,
                description: appointment.description,
                start: appointment.start,
                duration: appointment.duration,
                appointmentType: AppointmentType.Group,
            };
            convertedAppointments.push(converted);
        }
        return convertedAppointments;
    };

    const _allAppointmentsToShow = () => {
        const appointments: Appointment[] = [];
        const convertedAppointments = _convertAppointments();
        const all = appointments.concat(convertedAppointments);
        return all;
    };
    const allAppointmentsToShow = _allAppointmentsToShow();

    return (
        <>
            <Modal isOpen={showModal} backgroundColor="transparent" onClose={() => setShowModal(false)}>
                <CreateCourseAppointmentModal closeModal={() => setShowModal(false)} />
            </Modal>
            <Box>
                <Box maxH={maxHeight} flex="1" mb="10">
                    {allAppointmentsToShow.length === 0 ? (
                        <Box justifyContent="center">
                            <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.createNewAppointmentDesc')} />
                        </Box>
                    ) : (
                        <AppointmentList isReadOnly={true} appointments={allAppointmentsToShow} />
                    )}
                </Box>

                <Button
                    variant="outline"
                    borderStyle="dashed"
                    borderWidth="2"
                    borderColor="primary.500"
                    _text={{ color: 'primary.500' }}
                    width="full"
                    onPress={() => setShowModal(true)}
                >
                    {t('course.appointments.addOtherAppointment')}
                </Button>
                <Divider my="5" />

                <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" justifyContent="center" space={3}>
                    <Button onPress={next} width={buttonWidth}>
                        {t('course.appointments.check')}
                    </Button>
                    <Button variant="outline" onPress={back} width={buttonWidth}>
                        {t('course.appointments.prevPage')}
                    </Button>
                </Stack>
            </Box>
        </>
    );
};

export default CourseAppointments;
