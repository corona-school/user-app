import { useQuery } from '@apollo/client';
import { Box, Button, Divider, Modal, Stack, useBreakpointValue } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateCourseAppointments } from '../../context/AppointmentContext';
import { Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import AppointmentsEmptyState from '../../widgets/AppointmentsEmptyState';
import CreateCourseAppointmentModal from './CreateCourseAppointmentModal';
import ButtonRow from './ButtonRow';
import { gql } from '../../gql/gql';

type Props = {
    next: () => void;
    back: () => void;
    isEditing?: boolean;
    courseId?: number;
};

const GET_COURSE_APPOINTMENTS = gql(`
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
    // TODO query on editing modus
    const { data } = useQuery(GET_COURSE_APPOINTMENTS, { variables: { id: courseId ?? 0 } });

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
                start: appointment.start,
                duration: appointment.duration,
                appointmentType: Lecture_Appointmenttype_Enum.Group,
                ...(appointment?.title ? { title: appointment?.title } : { title: '' }),
                ...(appointment?.description ? { description: appointment?.description } : { description: '' }),
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

    const appointmentsOfEditingCourse = data?.subcourse?.appointments ?? [];
    console.log('appointments', appointmentsOfEditingCourse);

    // * validate if min one appointment is created
    const tryNext = () => {};

    return (
        <>
            <Modal isOpen={showModal} backgroundColor="transparent" onClose={() => setShowModal(false)}>
                <CreateCourseAppointmentModal closeModal={() => setShowModal(false)} total={appointmentsToBeCreated.length} />
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
                <ButtonRow onNext={next} onBack={back} />
            </Box>
        </>
    );
};

export default CourseAppointments;
