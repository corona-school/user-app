import { gql, useQuery } from '@apollo/client';
import { Box, Button, Divider, Modal, Stack, useBreakpointValue } from 'native-base';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateAppointment, useCreateCourseAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import AppointmentsEmptyState from '../../widgets/AppointmentsEmptyState';
import CreateCourseAppointmentModal from './CreateCourseAppointmentModal';
import ButtonRow from './ButtonRow';
import { DateTime } from 'luxon';
import { CreateCourseContext } from '../CreateCourse';
import { FormReducerActionType, WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';

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
                displayName
                isCanceled
                subcourseId
                matchId
                participants(skip: 0, take: 10) {
                    id
                    userID
                    firstname
                    lastname
                }
                organizers(skip: 0, take: 10) {
                    id
                    userID
                    firstname
                    lastname
                }
                isOrganizer
                isParticipant
                declinedBy
            }
        }
    }
`;

const CourseAppointments: React.FC<Props> = ({ next, back }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);
    const { dispatchCreateAppointment } = useCreateAppointment();
    const { dispatchWeeklyAppointment } = useWeeklyAppointments();

    const { appointmentsToBeCreated } = useCreateCourseAppointments();
    const { courseName } = useContext(CreateCourseContext);

    // TODO query on editing modus
    // const { data, loading, error } = useQuery(GET_COURSE_APPOINTMENTS, {variables: { id: 1 },});

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const closeModal = () => {
        setShowModal(false);
        dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
        dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });
    };

    const convertAppointments = () => {
        let convertedAppointments: Appointment[] = [];

        appointmentsToBeCreated.forEach((appointment) => {
            convertedAppointments.push({
                id: 1,
                start: appointment.start,
                duration: appointment.duration,
                appointmentType: Lecture_Appointmenttype_Enum.Group,
                displayName: courseName,
                ...(appointment?.title ? { title: appointment?.title } : { title: '' }),
                ...(appointment?.description ? { description: appointment?.description } : { description: '' }),
            });
        });

        return convertedAppointments;
    };

    const getAllAppointmentsToShow = () => {
        const appointments: Appointment[] = [];
        const convertedAppointments = convertAppointments();
        const allAppointments = appointments.concat(convertedAppointments);
        const sortedAppointments = allAppointments.sort((a, b) => {
            const _a = DateTime.fromISO(a.start).toMillis();
            const _b = DateTime.fromISO(b.start).toMillis();
            return _a - _b;
        });

        let sortedWithPosition: Appointment[] = [];
        sortedAppointments.forEach((appointment, index) => {
            sortedWithPosition.push({ ...appointment, position: index + 1 });
        });

        return sortedWithPosition;
    };
    const allAppointmentsToShow = getAllAppointmentsToShow();

    return (
        <>
            <Modal isOpen={showModal} backgroundColor="transparent" onClose={closeModal}>
                {showModal && <CreateCourseAppointmentModal closeModal={closeModal} total={appointmentsToBeCreated.length} />}
            </Modal>
            <Box>
                <Box maxH={maxHeight} flex="1" mb="10">
                    {allAppointmentsToShow.length === 0 ? (
                        <Box justifyContent="center">
                            <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.createNewAppointmentDesc')} />
                        </Box>
                    ) : (
                        <Box minH={400}>
                            <AppointmentList isReadOnlyList={true} appointments={allAppointmentsToShow} />
                        </Box>
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
                <ButtonRow onNext={next} onBack={back} isDisabled={allAppointmentsToShow.length === 0 ? true : false} />
            </Box>
        </>
    );
};

export default CourseAppointments;
