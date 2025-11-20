import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '@/gql/graphql';
import AppointmentList, { DisplayAppointment } from '../../widgets/AppointmentList';
import { DateTime } from 'luxon';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import RejectAppointmentModal, { RejectType } from '@/modals/RejectAppointmentModal';

type Props = {
    isEditingCourse?: boolean;
    subcourseId?: number;
    appointments: DisplayAppointment[];
    setAppointments: Dispatch<SetStateAction<DisplayAppointment[] | undefined>>;
    errors: string[];
    setAppointmentErrors: (hasErrors: boolean) => void;
};

const CourseAppointments: React.FC<Props> = ({ isEditingCourse, appointments, subcourseId, setAppointments, errors, setAppointmentErrors }) => {
    const { t } = useTranslation();

    const [creating, setCreating] = useState<boolean>(false);
    // a new appointment which is currently being created
    const [placeholderId, setPlaceholderId] = useState<string | undefined>(undefined);
    const [appointmentToDelete, setAppointmentToDelete] = useState<DisplayAppointment | undefined>(undefined);

    const [appointmentsWithErrors, setAppointmentsWithErrors] = useState<string[]>([]);

    // inform parent about errors
    useEffect(() => {
        if (appointmentsWithErrors.length > 0) {
            setAppointmentErrors(true);
        } else {
            setAppointmentErrors(false);
        }
    }, [appointmentsWithErrors, setAppointmentErrors]);

    const getDraftAppointments = useMemo(() => {
        const draftAppointments = [...appointments].sort((a, b) => DateTime.fromISO(a.start).toMillis() - DateTime.fromISO(b.start).toMillis());
        if (creating) {
            return [
                ...draftAppointments,
                {
                    isNew: true,
                    newId: placeholderId,
                    id: -1,
                    start: DateTime.now().plus({ days: 7 }).toISO(),
                    duration: 60,
                    appointmentType: Lecture_Appointmenttype_Enum.Group,
                    displayName: '',
                    title: '',
                    description: '',
                },
            ];
        }
        return draftAppointments;
    }, [appointments, creating, placeholderId]);

    const onCreateAppointment = () => {
        const newId = crypto.randomUUID();
        setPlaceholderId(newId);
        setAppointmentsWithErrors((prev) => [...prev, newId]); // unfinished appointment => error (gets cleared in onAppointmentEdited)
        setCreating(true);
    };

    const validateInputs = (appointment: DisplayAppointment): string[] => {
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

    const onAppointmentEdited = (updated: DisplayAppointment) => {
        const errors = validateInputs(updated);

        if (errors.length > 0) {
            setAppointmentsWithErrors((prev) => [...prev, updated.isNew ? updated.newId! : updated.id.toString()]);
            console.log('Appointment Errors:', errors);
            return { errors };
        } else {
            setAppointmentsWithErrors((prev) => prev.filter((id) => id !== (updated.isNew ? updated.newId! : updated.id.toString())));
        }

        if (updated.isNew) {
            setCreating(false);
            console.log('Edited new appointment with newId:', updated.newId, updated);
            const edited = getDraftAppointments.findIndex((x) => x.newId === updated.newId);
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

    const onAppointmentDuplicate = (duplicate: DisplayAppointment) => {
        console.log('Duplicating appointment');
        const newId = crypto.randomUUID();
        setAppointments((prev) => [
            ...(prev ?? []),
            {
                ...duplicate,
                isNew: true,
                newId,
                id: -1, // Temporary ID until saved
            },
        ]);
        setAppointmentsWithErrors((prev) => [...prev, newId]); // add error for unfinished appointment
        setPlaceholderId(newId);
    };

    const onAppointmentDelete = (deleted: DisplayAppointment | undefined) => {
        if (!deleted) {
            throw new Error('Cannot delete appointment, no appointment provided');
        }
        if (deleted.isNew) {
            // If it's a new appointment, just remove it from the list
            setAppointments((prev) => prev?.filter((x) => x.newId !== deleted.newId));
        } else {
            // decline appointment
            setAppointments((prev) => prev?.filter((x) => x.id !== deleted.id));
        }
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
                            appointments={getDraftAppointments}
                            onAppointmentBeginEdit={(appointment) => {
                                setAppointmentsWithErrors((prev) => [...prev, appointment.isNew ? appointment.newId! : appointment.id.toString()]); // add error for unfinished appointment
                            }}
                            onAppointmentEdited={onAppointmentEdited}
                            onAppointmentCanceledEdit={(appointment) => {
                                if (creating) {
                                    setCreating(false);
                                    setPlaceholderId(undefined);
                                    setAppointmentsWithErrors((prev) => prev.filter((id) => id !== placeholderId)); // remove error for unfinished appointment
                                } else {
                                    setAppointmentsWithErrors((prev) => prev.filter((id) => id !== appointment.id.toString() && id !== appointment.newId));
                                }
                            }}
                            onAppointmentDuplicate={!creating ? onAppointmentDuplicate : undefined}
                            onAppointmentDelete={(x) => (x.isNew ? onAppointmentDelete(x) : setAppointmentToDelete(x))}
                            editingIdInit={placeholderId}
                            clickable={false}
                            editable={true}
                        />
                    </div>
                )}
                <Button onClick={onCreateAppointment} variant={'default'} className="w-full p-6" disabled={creating}>
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
