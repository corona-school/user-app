import { useQuery } from '@apollo/client';
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
import { gql } from '../../gql/gql';
import { DateTime } from 'luxon';
import { CreateCourseContext } from '../CreateCourse';
import { FormReducerActionType, WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';

type Props = {
    next: () => void;
    back: () => void;
    isEditing?: boolean;
    courseId?: number;
};

const COURSE_APPOINTMENTS = gql(`
    query courseAppointments($id: Int!) {
        subcourse(subcourseId: $id) {
            course {
                name
            }
            appointments {
                id
                subcourseId
                start
                duration
                title
                description
                displayName
                position
                total
                appointmentType
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

const CourseAppointments: React.FC<Props> = ({ next, back, isEditing, courseId }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editingAppointmentId, setEditingAppointmentId] = useState<number>(0);

    const { appointmentsToBeCreated } = useCreateCourseAppointments();
    const { data } = useQuery(COURSE_APPOINTMENTS, { variables: { id: courseId ?? 0 } });
    const { dispatchCreateAppointment } = useCreateAppointment();
    const { dispatchWeeklyAppointment } = useWeeklyAppointments();

    const { courseName } = useContext(CreateCourseContext);

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

    const appointmentsOfEditingCourse = data?.subcourse?.appointments ?? [];

    // * validate if min one appointment is created
    const canGoFurther = () => {
        if (isEditing) return appointmentsOfEditingCourse.length === 0 ? true : false;
        return allAppointmentsToShow.length === 0 ? true : false;
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
                    {!isEditing && allAppointmentsToShow.length === 0 ? (
                        <Box justifyContent="center">
                            <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.createNewAppointmentDesc')} />
                        </Box>
                    ) : (
                        <Box minH={400}>
                            <AppointmentList
                                isReadOnlyList={true}
                                appointments={isEditing ? (appointmentsOfEditingCourse as Appointment[]) : allAppointmentsToShow}
                            />
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
                <ButtonRow onNext={next} onBack={back} isDisabled={canGoFurther()} />
            </Box>
        </>
    );
};

export default CourseAppointments;
