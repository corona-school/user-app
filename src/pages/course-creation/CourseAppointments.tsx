import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateAppointment, useCreateCourseAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentList from '../../widgets/AppointmentList';
import CreateCourseAppointmentModal from './CreateCourseAppointmentModal';
import { DateTime } from 'luxon';
import { CreateCourseContext } from '../CreateCourse';
import { FormReducerActionType, WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

type Props = {
    isEditing?: boolean;
    appointments: Appointment[];
};

const CourseAppointments: React.FC<Props> = ({ isEditing, appointments }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);

    const { appointmentsToBeCreated } = useCreateCourseAppointments();
    const { dispatchCreateAppointment } = useCreateAppointment();
    const { dispatchWeeklyAppointment } = useWeeklyAppointments();

    const { courseName } = useContext(CreateCourseContext);

    const handleOnOpenChange = (open: boolean) => {
        setShowModal(open);
        if (!open) {
            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });
        }
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
    const canGoFurther = () => {
        return allAppointmentsToShow.length === 0 ? true : false;
    };
    const getAllAppointmentsToShow = () => {
        if (isEditing) {
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
        }
        const newAppointments: Appointment[] = [];
        const convertedAppointments = convertAppointments();
        const allAppointments = newAppointments.concat(convertedAppointments);
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
            <Typography variant="h3">{t('course.CourseDate.step.appointments')}</Typography>

            <CreateCourseAppointmentModal isOpen={showModal} onOpenChange={handleOnOpenChange} total={allAppointmentsToShow.length} />
            <div>
                {!isEditing && allAppointmentsToShow.length > 0 && (
                    <div className="mb-2">
                        <AppointmentList height="100%" isReadOnlyList={true} appointments={allAppointmentsToShow} />
                    </div>
                )}
                <Button onClick={() => setShowModal(true)} variant={'default'} className="w-full p-6">
                    {allAppointmentsToShow.length === 0 ? t('course.appointments.addFirstAppointment') : t('course.appointments.addOtherAppointment')}
                </Button>
            </div>
        </>
    );
};

export default CourseAppointments;
