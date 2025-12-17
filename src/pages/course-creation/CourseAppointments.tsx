import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '@/gql/graphql';
import AppointmentList from '../../widgets/AppointmentList';
import { DateTime } from 'luxon';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import RejectAppointmentModal, { RejectType } from '@/modals/RejectAppointmentModal';
import { Appointment } from '@/types/lernfair/Appointment';

type Props = {
    isEditingCourse?: boolean;
    subcourseId?: number;
    appointments: Appointment[];
    setAppointments: Dispatch<SetStateAction<Appointment[] | undefined>>;
    errors: string[];
    setAppointmentErrors: (hasErrors: boolean) => void;
};

const CourseAppointments: React.FC<Props> = ({ isEditingCourse, appointments, subcourseId, setAppointments, errors, setAppointmentErrors }) => {
    const { t } = useTranslation();
    // a new appointment which is currently being created (either by clicking on "New Appointment" button or by duplicating another appointment
    const [placeholderId, setPlaceholderId] = useState<number | undefined>(undefined);
    // contrary to duplicated appointments, when creating a blank appointment, it should stick to the bottom
    const [stickyBottomId, setStickyBottomId] = useState<number | undefined>(undefined);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | undefined>(undefined);
    const [appointmentsWithErrors, setAppointmentsWithErrors] = useState<number[]>([]);

    // inform parent about errors
    useEffect(() => {
        if (appointmentsWithErrors.length > 0) {
            setAppointmentErrors(true);
        } else {
            setAppointmentErrors(false);
        }
    }, [appointmentsWithErrors, setAppointmentErrors]);

    const getDraftAppointments = useMemo(() => {
        let stickyAppointment = undefined;
        let sorted = [...appointments]
            .map((a) => {
                if (a.id === stickyBottomId) stickyAppointment = a;
                return a;
            })
            .filter((a) => a.id !== stickyBottomId)
            .sort((a, b) => {
                let aKey = DateTime.fromISO(a.start).toMillis();
                let bKey = DateTime.fromISO(b.start).toMillis();
                return aKey - bKey;
            });
        if (stickyAppointment) sorted.push(stickyAppointment);
        return sorted;
    }, [appointments, stickyBottomId]);

    const onCreateAppointment = () => {
        const newId = -Date.now();
        setAppointmentsWithErrors((prev) => [...prev, newId]); // unfinished appointment => error (gets cleared in onAppointmentEdited)
        setAppointments(() => {
            const newAppointments = [...getDraftAppointments];
            newAppointments.push({
                id: newId,
                start: DateTime.now().plus({ days: 7 }).toISO(),
                duration: 60,
                appointmentType: Lecture_Appointmenttype_Enum.Group,
                displayName: '',
                title: '',
                description: '',
            });
            return newAppointments;
        });
        setPlaceholderId(newId);
        setStickyBottomId(newId);
    };

    const validateInputs = (appointment: Appointment): string[] => {
        // check if date field is valid date
        const errors = [];
        if (!DateTime.fromISO(appointment.start).isValid) {
            errors.push('invalidDate');
        }

        // check if appointment is at least 7 days in the future
        if (DateTime.fromISO(appointment.start).endOf('day').diffNow('days').days < 7) {
            errors.push('dateNotInOneWeek');
        }

        // check if link is valid
        if (appointment.override_meeting_link) {
            const urlRegex = /^(https?):\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(?:\/[^\s]*)?$/;
            if (!urlRegex.test(appointment.override_meeting_link)) {
                errors.push('invalidLink');
            }
        }
        return errors;
    };

    const onAppointmentEdited = (updated: Appointment) => {
        const errors = validateInputs(updated);

        if (errors.length > 0) {
            setAppointmentsWithErrors((prev) => [...prev, updated.id]);
            console.log('Appointment Errors:', errors);
            return { errors };
        } else {
            setAppointmentsWithErrors((prev) => prev.filter((id) => id !== updated.id));
        }

        if (updated.id < 0) {
            console.log('Edited new appointment with id:', updated.id, updated);
            if (placeholderId === updated.id) setPlaceholderId(undefined);
            if (stickyBottomId === updated.id) setStickyBottomId(undefined);
            const edited = getDraftAppointments.findIndex((x) => x.id === updated.id);
            // update the edited appointment
            setAppointments(() => {
                const newAppointments = [...getDraftAppointments];
                newAppointments[edited] = {
                    ...updated,
                    appointmentType: Lecture_Appointmenttype_Enum.Group,
                    subcourseId: subcourseId ?? -1,
                };
                return newAppointments;
            });
        } else {
            console.log('Editing existing appointment');
            const edited = getDraftAppointments.findIndex((x) => x.id === updated.id);
            // update the edited appointment
            setAppointments(() => {
                const newAppointments = [...getDraftAppointments];
                newAppointments[edited] = {
                    ...updated,
                    appointmentType: Lecture_Appointmenttype_Enum.Group,
                    subcourseId: subcourseId ?? -1,
                };
                return newAppointments;
            });
        }
    };

    const onAppointmentDuplicate = (duplicate: Appointment) => {
        console.log('Duplicating appointment');
        const newId = -Date.now();
        setAppointments((prev) => [
            ...(prev ?? []),
            {
                ...duplicate,
                id: newId, // Temporary ID until saved
            },
        ]);
        setAppointmentsWithErrors((prev) => [...prev, newId]); // add error for unfinished appointment
        setPlaceholderId(newId);
    };

    const onAppointmentDelete = (deleted: Appointment | undefined) => {
        if (!deleted) {
            throw new Error('Cannot delete appointment, no appointment provided');
        }
        setAppointments((prev) => prev?.filter((x) => x.id !== deleted.id));
        setAppointmentToDelete(undefined);
    };

    return (
        <>
            <RejectAppointmentModal
                isOpen={appointmentToDelete != null}
                onDelete={() => onAppointmentDelete(appointmentToDelete)}
                onOpenChange={(open) => !open && setAppointmentToDelete(undefined)}
                rejectType={RejectType.CANCEL}
            />
            <Typography variant="h4">{t('course.CourseDate.step.appointments')}</Typography>
            <div>
                {(isEditingCourse || getDraftAppointments.length !== 0) && (
                    <div className="mb-2">
                        <AppointmentList
                            height="100%"
                            isReadOnlyList={false}
                            noOldAppointments={true}
                            appointments={getDraftAppointments}
                            onAppointmentBeginEdit={(appointment) => {
                                setAppointmentsWithErrors((prev) => [...prev, appointment.id]); // add error for unfinished appointment
                            }}
                            onAppointmentEdited={onAppointmentEdited}
                            onAppointmentCanceledEdit={(appointment) => {
                                if (placeholderId === appointment.id) {
                                    setPlaceholderId(undefined);
                                    setAppointments((prev) => prev?.filter((a) => a.id !== appointment.id));
                                    setAppointmentsWithErrors((prev) => prev.filter((id) => id !== placeholderId)); // remove error for unfinished appointment
                                } else {
                                    setAppointmentsWithErrors((prev) => prev.filter((id) => id !== appointment.id));
                                }
                            }}
                            onAppointmentDuplicate={!placeholderId ? onAppointmentDuplicate : undefined}
                            onAppointmentDelete={(x) => (x.id < 0 ? onAppointmentDelete(x) : setAppointmentToDelete(x))}
                            editingIdInit={placeholderId}
                            clickable={false}
                            editable={true}
                            exhaustive={true}
                        />
                    </div>
                )}
                <Button onClick={onCreateAppointment} variant={'default'} className="w-full p-6" disabled={!!placeholderId}>
                    {getDraftAppointments.length === 0 ? t('course.appointments.addFirstAppointment') : t('course.appointments.addOtherAppointment')}
                </Button>
            </div>

            {errors.includes('unfinished-appointment') && (
                <Typography variant="sm" className="text-red-500 error">
                    {t('course.error.unfinished-appointment')}
                </Typography>
            )}
        </>
    );
};

export default CourseAppointments;
