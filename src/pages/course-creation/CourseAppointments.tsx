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
    isEditingCourse?: boolean;
    existingAppointments: DisplayAppointment[];
    subcourseId?: number;
};

const CourseAppointments: React.FC<Props> = ({ isEditingCourse, existingAppointments, subcourseId }) => {
    const { t } = useTranslation();
    const [editId, setEditId] = useState<number | undefined>(undefined);

    const [appointmentsToBeCreated, setAppointmentsToBeCreated] = useState<DisplayAppointment[]>([]);

    const { courseName } = useContext(CreateCourseContext);
    const [creating, setCreating] = useState<boolean>(false);
    const [editingIdInit, setEditingIdInit] = useState<number | undefined>(undefined);

    const getAllAppointmentsToShow = (creating: boolean) => {
        if (isEditingCourse) {
            const appointmentsToBeCreatedWithIndex = [];
            for (let i = 0; i < appointmentsToBeCreated.length; i++) {
                appointmentsToBeCreatedWithIndex.push({
                    ...appointmentsToBeCreated[i],
                    newId: i,
                });
            }
            const allAppointments = existingAppointments.concat(appointmentsToBeCreatedWithIndex);

            if (creating) {
                console.log('Creating new appointment, inserting empty appointment at the front');
                allAppointments.push({
                    isNew: true,
                    newId: appointmentsToBeCreated.length,
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
        } else {
            return [];
        }
        // TODO
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
                {(isEditingCourse || allAppointmentsToShow.length !== 0) && (
                    <div className="mb-2">
                        <AppointmentList
                            height="100%"
                            isReadOnlyList={false}
                            appointments={allAppointmentsToShow}
                            noOldAppointments={subcourseId === undefined}
                            onAppointmentEdited={(updated) => {
                                // todo what if existing appointment is edited?
                                if (updated.isNew) {
                                    console.log('edited new appointment with newIndex:', updated.newId, updated);
                                    setAppointmentsToBeCreated((prev) => {
                                        const newAppointments = [...prev];
                                        newAppointments[updated.newId!] = {
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
