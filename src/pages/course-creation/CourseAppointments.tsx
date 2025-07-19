import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateAppointment, useCreateCourseAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentList, { DisplayAppointment } from '../../widgets/AppointmentList';
import { DateTime } from 'luxon';
import { CreateCourseContext } from '../CreateCourse';
import { FormReducerActionType, WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

type Props = {
    isEditing?: boolean;
    appointments: DisplayAppointment[];
    subcourseId?: number;
};

const CourseAppointments: React.FC<Props> = ({ isEditing, appointments, subcourseId }) => {
    const { t } = useTranslation();
    const [editId, setEditId] = useState<number | undefined>(undefined);

    const { appointmentsToBeCreated, setAppointmentsToBeCreated } = useCreateCourseAppointments();
    const { dispatchCreateAppointment } = useCreateAppointment();
    const { dispatchWeeklyAppointment } = useWeeklyAppointments();

    const { courseName } = useContext(CreateCourseContext);
    const [creating, setCreating] = useState<boolean>(false);
    const [editingIdInit, setEditingIdInit] = useState<number | undefined>(undefined);
    const convertAppointments = (creating: boolean) => {
        let convertedAppointments: DisplayAppointment[] = [];

        appointmentsToBeCreated.forEach((appointment, index) => {
            convertedAppointments.push({
                isNew: true,
                newIndex: index,
                id: -1,
                start: appointment.start,
                duration: appointment.duration,
                appointmentType: Lecture_Appointmenttype_Enum.Group,
                displayName: courseName,
                ...(appointment?.title ? { title: appointment?.title } : { title: '' }),
                ...(appointment?.description ? { description: appointment?.description } : { description: '' }),
            });
        });

        // insert empty appointment in front of sortedAppointments
        if (creating) {
            console.log('Creating new appointment, inserting empty appointment at the front');
            convertedAppointments.push({
                isNew: true,
                newIndex: appointmentsToBeCreated.length,
                id: -1,
                start: DateTime.now().plus({ days: 7 }).toISO(),
                duration: 60,
                appointmentType: Lecture_Appointmenttype_Enum.Group,
                displayName: courseName,
                title: '',
                description: '',
            });
            setEditingIdInit(appointmentsToBeCreated.length);
        }

        return convertedAppointments;
    };
    const canGoFurther = () => {
        return allAppointmentsToShow.length === 0 ? true : false;
    };
    const getAllAppointmentsToShow = (creating: boolean) => {
        if (isEditing) {
            const convertedAppointments = convertAppointments(creating);
            const allAppointments = appointments.concat(convertedAppointments);
            const sortedAppointments = allAppointments.sort((a, b) => {
                const _a = DateTime.fromISO(a.start).toMillis();
                const _b = DateTime.fromISO(b.start).toMillis();
                return _a - _b;
            });
            let sortedWithPosition: DisplayAppointment[] = [];
            sortedAppointments.forEach((appointment, index) => {
                sortedWithPosition.push({ ...appointment, position: index + 1 });
            });
            console.log('sortedWithPosition', sortedWithPosition);
            return sortedWithPosition;
        }
        const newAppointments: DisplayAppointment[] = [];
        const convertedAppointments = convertAppointments(creating);
        const allAppointments = newAppointments.concat(convertedAppointments);
        const sortedAppointments = allAppointments.sort((a, b) => {
            const _a = DateTime.fromISO(a.start).toMillis();
            const _b = DateTime.fromISO(b.start).toMillis();
            return _a - _b;
        });

        let sortedWithPosition: DisplayAppointment[] = [];
        sortedAppointments.forEach((appointment, index) => {
            sortedWithPosition.push({ ...appointment, position: index + 1 });
        });

        return sortedWithPosition;
    };
    const [allAppointmentsToShow, setAllAppointmentsToShow] = useState<DisplayAppointment[]>(getAllAppointmentsToShow(false));

    const onCreateAppointment = () => {
        setCreating(true);
        setAllAppointmentsToShow(getAllAppointmentsToShow(true));
    };

    useEffect(() => {
        setCreating(false);
        setAllAppointmentsToShow(getAllAppointmentsToShow(false));
    }, [appointmentsToBeCreated]);

    return (
        <>
            <Typography variant="h3">{t('course.CourseDate.step.appointments')}</Typography>
            <div>
                {(isEditing || allAppointmentsToShow.length !== 0) && (
                    <div className="mb-2">
                        <AppointmentList
                            height="100%"
                            isReadOnlyList={false}
                            appointments={allAppointmentsToShow}
                            noOldAppointments={subcourseId === undefined}
                            onAppointmentEdited={(updated) => {
                                // todo what if existing appointment is edited?
                                if (updated.isNew) {
                                    console.log('edited new appointment with newIndex:', updated.newIndex, updated);
                                    setAppointmentsToBeCreated((prev) => {
                                        const newAppointments = [...prev];
                                        newAppointments[updated.newIndex!] = {
                                            ...updated,
                                            appointmentType: Lecture_Appointmenttype_Enum.Group,
                                            subcourseId: subcourseId ?? -1,
                                        };
                                        return newAppointments;
                                    });
                                } else {
                                    console.log('Editing existing appointment');
                                }
                            }}
                            onAppointmentCanceledEdit={() => {
                                setCreating(false);
                                setAllAppointmentsToShow(getAllAppointmentsToShow(false));
                            }}
                            onAppointmentDuplicate={
                                !creating
                                    ? (duplicate) => {
                                          console.log('Duplicating appointment');
                                          setAppointmentsToBeCreated((prev) => {
                                              const newAppointments = [...prev];
                                              newAppointments.push({
                                                  ...duplicate,
                                                  appointmentType: Lecture_Appointmenttype_Enum.Group,
                                                  subcourseId: subcourseId ?? -1,
                                              });
                                              return newAppointments;
                                          });
                                      }
                                    : undefined
                            }
                            editingIdInit={editingIdInit}
                        />
                    </div>
                )}
                <Button onClick={onCreateAppointment} variant={'default'} className="w-full p-6" disabled={creating}>
                    {allAppointmentsToShow.length === 0 ? t('course.appointments.addFirstAppointment') : t('course.appointments.addOtherAppointment')}
                </Button>
            </div>
        </>
    );
};

export default CourseAppointments;
