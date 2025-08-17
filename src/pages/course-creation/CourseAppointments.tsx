import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import AppointmentList, { DisplayAppointment } from '../../widgets/AppointmentList';
import { DateTime } from 'luxon';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

type Props = {
    isEditingCourse?: boolean;
    subcourseId?: number;
    appointments: DisplayAppointment[];
    setAppointments: Dispatch<SetStateAction<DisplayAppointment[] | undefined>>;
};

const CourseAppointments: React.FC<Props> = ({ isEditingCourse, appointments, subcourseId, setAppointments }) => {
    const { t } = useTranslation();

    const [creating, setCreating] = useState<boolean>(false);
    // const [_draftAppointments, setDraftAppointments] = useState<DisplayAppointment[]>(appointments);
    const [placeholderId, setPlaceholderId] = useState<string | undefined>(undefined);

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
        setPlaceholderId(crypto.randomUUID());
        setCreating(true);
    };

    const validateInputs = (appointment: DisplayAppointment): string[] => {
        // check if date field is valid date
        const errors = [];
        if (!DateTime.fromISO(appointment.start).isValid) {
            errors.push('invalidDate');
        }

        // check if appointment is at least 7 days in the future
        if (DateTime.fromISO(appointment.start).startOf('day').diffNow('days').days < 7) {
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
            return { errors };
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
        setPlaceholderId(newId);
    };

    return (
        <>
            <Typography variant="h3">{t('course.CourseDate.step.appointments')}</Typography>
            <div>
                {(isEditingCourse || getDraftAppointments.length !== 0) && (
                    <div className="mb-2">
                        <AppointmentList
                            height="100%"
                            isReadOnlyList={false}
                            appointments={getDraftAppointments}
                            noOldAppointments={subcourseId === undefined}
                            onAppointmentEdited={onAppointmentEdited}
                            onAppointmentCanceledEdit={() => {
                                setCreating(false);
                            }}
                            onAppointmentDuplicate={!creating ? onAppointmentDuplicate : undefined}
                            editingIdInit={placeholderId}
                        />
                    </div>
                )}
                <Button onClick={onCreateAppointment} variant={'default'} className="w-full p-6" disabled={creating}>
                    {getDraftAppointments.length === 0 ? t('course.appointments.addFirstAppointment') : t('course.appointments.addOtherAppointment')}
                </Button>
            </div>
        </>
    );
};

export default CourseAppointments;
