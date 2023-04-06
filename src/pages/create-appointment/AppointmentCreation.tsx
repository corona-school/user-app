import { Box, Button, Checkbox, Stack, useBreakpointValue, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import WeeklyAppointments from './WeeklyAppointments';
import AppointmentForm from './AppointmentForm';
import { DateTime } from 'luxon';
import { useMutation } from '@apollo/client';
import { useCreateAppointment, useCreateCourseAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { FormReducerActionType, WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';
import { CreateAppointmentInput } from '../../types/lernfair/Appointment';
import { useCallback, useState } from 'react';
import { AppointmentCreateGroupInput, AppointmentCreateMatchInput, AppointmentType } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { gql } from '../../gql/gql';

type FormErrors = {
    title?: string;
    date?: string;
    time?: string;
    duration?: string;
    description?: string;
    dateNotInOneWeek?: string;
};

export type StartDate = {
    date: string;
    time: string;
};

type Props = {
    courseOrMatchId?: number;
    isCourse?: boolean;
    isCourseCreation?: boolean;
    appointmentsTotal?: number;
    back: () => void;
    closeModal?: () => void;
};

const AppointmentCreation: React.FC<Props> = ({ back, courseOrMatchId, isCourse, isCourseCreation, appointmentsTotal, closeModal }) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointment();
    const { appointmentsToBeCreated, setAppointmentsToBeCreated } = useCreateCourseAppointments();
    const { weeklies, dispatchWeeklyAppointment } = useWeeklyAppointments();
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const toast = useToast();
    const navigate = useNavigate();

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '25%',
    });

    const [createGroupAppointments] = useMutation(
        gql(`
        mutation appointmentsGroupCreate($appointments: [AppointmentCreateGroupInput!]!, $id: Float!) {
            appointmentsGroupCreate(appointments: $appointments, subcourseId: $id)
        }
    `)
    );

    const [createMatchAppointments] = useMutation(
        gql(`
        mutation appointmentsMatchCreate($appointments: [AppointmentCreateMatchInput!]!, $id: Float!) {
            appointmentsMatchCreate(appointments: $appointments, matchId: $id)
        }
    `)
    );

    const convertStartDate = (date: string, time: string) => {
        const dt = DateTime.fromISO(date);
        const t = DateTime.fromISO(time);

        const newDate = dt.set({
            hour: t.hour,
            minute: t.minute,
            second: t.second,
        });
        return newDate.toISO();
    };
    const validateInputs = () => {
        const isDateMinOneWeekLater = (date: string): boolean => {
            const startDate = DateTime.fromISO(date);
            const diff = startDate.diffNow('days').days;
            if (diff >= 6) return true;
            return false;
        };

        if (!appointmentToCreate.date) {
            setErrors({ ...errors, date: t('appointment.errors.date') });
            return false;
        } else {
            delete errors.date;
        }
        if (isDateMinOneWeekLater(appointmentToCreate.date) === false) {
            setErrors({ ...errors, dateNotInOneWeek: t('appointment.errors.dateMinOneWeek') });
            return false;
        } else {
            delete errors.date;
        }
        if (!appointmentToCreate.time.length) {
            setErrors({ ...errors, time: t('appointment.errors.time') });
            return false;
        } else {
            delete errors.time;
        }
        if (appointmentToCreate.duration === 0) {
            setErrors({ ...errors, duration: t('appointment.errors.duration') });
            return false;
        } else {
            delete errors.duration;
        }
        return true;
    };
    const handleWeeklyCheck = () => {
        dispatchCreateAppointment({
            type: FormReducerActionType.TOGGLE_CHANGE,
            field: 'isRecurring',
        });
    };
    const handleCreateCourseAppointments = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            const newAppointment: AppointmentCreateGroupInput = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                duration: appointmentToCreate.duration,
                meetingLink: '',
                subcourseId: courseOrMatchId!,
                appointmentType: AppointmentType.Group,
            };
            if (isCourseCreation && weeklies.length === 0) {
                setAppointmentsToBeCreated([...appointmentsToBeCreated, newAppointment]);
            } else if (isCourseCreation && weeklies.length > 0) {
                let weeklyAppointments: AppointmentCreateGroupInput[] = [];

                for (const weekly of weeklies) {
                    const newWeeklyAppointment = {
                        title: weekly.title ? weekly.title : '',
                        description: weekly.description ? weekly.description : '',
                        start: weekly.nextDate,
                        duration: appointmentToCreate.duration,
                        meetingLink: '',
                        subcourseId: courseOrMatchId!,
                        appointmentType: AppointmentType.Group,
                    };
                    weeklyAppointments.push(newWeeklyAppointment);
                }
                setAppointmentsToBeCreated([...appointmentsToBeCreated, newAppointment, ...weeklyAppointments]);
            }

            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });

            toast.show({ description: weeklies.length > 0 ? 'Termine hinzugefügt' : 'Termin hinzugefügt', placement: 'top' });
            closeModal && closeModal();
        }
    };
    const handleCreateCourseAppointment = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            let appointments: AppointmentCreateGroupInput[] = [];

            const newAppointment: AppointmentCreateGroupInput = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                duration: appointmentToCreate.duration,
                meetingLink: '',
                subcourseId: courseOrMatchId ? courseOrMatchId : 1,
                appointmentType: AppointmentType.Group,
            };

            appointments.push(newAppointment);

            if (weeklies.length > 0) {
                let weeklyAppointments: AppointmentCreateGroupInput[] = [];

                for (const weekly of weeklies) {
                    const newWeeklyAppointment = {
                        title: weekly.title ? weekly.title : '',
                        description: weekly.description ? weekly.description : '',
                        start: weekly.nextDate,
                        duration: appointmentToCreate.duration,
                        meetingLink: '',
                        subcourseId: courseOrMatchId ? courseOrMatchId : 1,
                        appointmentType: AppointmentType.Group,
                    };
                    weeklyAppointments.push(newWeeklyAppointment);
                }
                appointments.push(...weeklyAppointments);
            }

            createGroupAppointments({ variables: { appointments, id: courseOrMatchId ? courseOrMatchId : 1 } });

            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });

            toast.show({ description: weeklies.length > 0 ? 'Termine hinzugefügt' : 'Termin hinzugefügt', placement: 'top' });
            navigate('/appointments');
        }
    };
    const handleCreateMatchAppointment = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            let appointments: AppointmentCreateMatchInput[] = [];

            const newAppointment: AppointmentCreateMatchInput = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                duration: appointmentToCreate.duration,
                meetingLink: '',
                matchId: courseOrMatchId ? courseOrMatchId : 1,
                appointmentType: AppointmentType.Match,
            };

            appointments.push(newAppointment);

            if (weeklies.length > 0) {
                let weeklyAppointments: AppointmentCreateMatchInput[] = [];

                for (const weekly of weeklies) {
                    const newWeeklyAppointment = {
                        title: weekly.title ? weekly.title : '',
                        description: weekly.description ? weekly.description : '',
                        start: weekly.nextDate,
                        duration: appointmentToCreate.duration,
                        meetingLink: '',
                        matchId: courseOrMatchId ? courseOrMatchId : 1,
                        appointmentType: AppointmentType.Match,
                    };
                    weeklyAppointments.push(newWeeklyAppointment);
                }
                appointments.push(...weeklyAppointments);
            }

            createMatchAppointments({ variables: { appointments, id: courseOrMatchId ? courseOrMatchId : 1 } });

            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });

            toast.show({ description: weeklies.length > 0 ? 'Termine hinzugefügt' : 'Termin hinzugefügt', placement: 'top' });
            navigate('/appointments');
        }
    };
    const calcNewAppointmentInOneWeek = useCallback(() => {
        const startDate = DateTime.fromISO(appointmentToCreate.date);
        const nextDate = startDate.plus({ days: 7 }).toISO();
        return nextDate;
    }, [appointmentToCreate.date]);

    return (
        <Box>
            <AppointmentForm errors={errors} appointmentsCount={appointmentsTotal ? appointmentsTotal : 0} />
            <Box py="8">
                <Checkbox
                    _checked={{ backgroundColor: 'danger.900' }}
                    onChange={() => handleWeeklyCheck()}
                    value={appointmentToCreate.isRecurring ? 'true' : 'false'}
                    isDisabled={appointmentToCreate.date ? false : true}
                >
                    {t('appointment.create.weeklyRepeat')}
                </Checkbox>
            </Box>
            {appointmentToCreate.isRecurring && <WeeklyAppointments appointmentsCount={appointmentsTotal ?? 0} nextDate={calcNewAppointmentInOneWeek()} />}
            <Stack direction={isMobile ? 'column' : 'row'} space={3} my="3">
                <Button
                    onPress={isCourseCreation ? handleCreateCourseAppointments : isCourse ? handleCreateCourseAppointment : handleCreateMatchAppointment}
                    width={buttonWidth}
                >
                    {t('appointment.create.addAppointmentButton')}
                </Button>
                <Button variant="outline" onPress={back} _text={{ padding: '3px 5px' }} width={buttonWidth}>
                    {t('appointment.create.backButton')}
                </Button>
            </Stack>
        </Box>
    );
};

export default AppointmentCreation;
