import { Box, Button, Checkbox, Stack, useBreakpointValue, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import WeeklyAppointments from './WeeklyAppointments';
import AppointmentForm from './AppointmentForm';
import { DateTime } from 'luxon';
import { gql, useMutation } from '@apollo/client';
import useApollo from '../../hooks/useApollo';
import { useCreateAppointment, useCreateCourseAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { AppointmentType, FormReducerActionType, WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';
import { CreateAppointmentInput } from '../../types/lernfair/Appointment';
import { useCallback, useState } from 'react';

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
    back: () => void;
    navigateTo: () => void;
    // course id oder match id
    id?: number;
    // if create appointment for course
    isCourse?: boolean;
    // if create course appointment
    isCourseCreation?: boolean;
};

const AppointmentCreation: React.FC<Props> = ({ back, navigateTo, id, isCourse, isCourseCreation }) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointment();
    const { appointmentsToBeCreated, setAppointmentsToBeCreated } = useCreateCourseAppointments();
    const { weeklies, dispatchWeeklyAppointment } = useWeeklyAppointments();
    const { user } = useApollo();
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const toast = useToast();

    const appointmentsCount = 2;

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '25%',
    });

    const [createAppointments] = useMutation(gql`
        mutation createAppointments($appointments: [AppointmentCreateInputFull!]!) {
            appointmentsCreate(appointments: $appointments)
        }
    `);

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

    // add course appointments to create to state
    const handleCreateCourseAppointments = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            const organizers = [user!.student!.id];
            const newAppointment: CreateAppointmentInput = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                organizers: organizers,
                duration: appointmentToCreate.duration,
                appointmentType: isCourse ? AppointmentType.GROUP : AppointmentType.ONE_ON_ONE,
            };
            if (isCourseCreation && weeklies.length === 0) {
                setAppointmentsToBeCreated([...appointmentsToBeCreated, newAppointment]);
            } else if (isCourseCreation && weeklies.length > 0) {
                let weeklyAppointments: CreateAppointmentInput[] = [];

                for (const weekly of weeklies) {
                    const newWeeklyAppointment = {
                        title: weekly.title ? weekly.title : '',
                        description: weekly.description ? weekly.description : '',
                        start: weekly.nextDate,
                        organizers: organizers,
                        duration: appointmentToCreate.duration,
                        appointmentType: AppointmentType.GROUP,
                    };
                    weeklyAppointments.push(newWeeklyAppointment);
                }
                setAppointmentsToBeCreated([...appointmentsToBeCreated, newAppointment, ...weeklyAppointments]);
            }

            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });

            toast.show({ description: weeklies.length > 0 ? 'Termine hinzugefügt' : 'Termin hinzugefügt', placement: 'top' });
            setTimeout(() => {
                navigateTo();
            }, 2000);
        }
    };

    // write new appointments directly (mutation)
    const handleCreateAppointment = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            let newAppointments: CreateAppointmentInput[] = [];
            const organizers = [user!.student!.id];
            const newAppointment: CreateAppointmentInput = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                organizers: organizers,
                duration: appointmentToCreate.duration,
                appointmentType: isCourse ? AppointmentType.GROUP : AppointmentType.ONE_ON_ONE,
                ...(isCourse ? { subcourseId: id } : { matchId: id }),
            };
            newAppointments.push(newAppointment);
            if (weeklies.length > 0) {
                let weeklyAppointments: CreateAppointmentInput[] = [];

                for (const weekly of weeklies) {
                    const newWeeklyAppointment = {
                        title: weekly.title ? weekly.title : '',
                        description: weekly.description ? weekly.description : '',
                        start: weekly.nextDate,
                        organizers: organizers,
                        duration: appointmentToCreate.duration,
                        appointmentType: AppointmentType.GROUP,
                    };
                    weeklyAppointments.push(newWeeklyAppointment);
                }
                newAppointments.push(...weeklyAppointments);
            }
            // createAppointments({ variables: { appointmentsToBeCreated } });

            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });

            toast.show({ description: weeklies.length > 0 ? 'Termine hinzugefügt' : 'Termin hinzugefügt', placement: 'top' });
            setTimeout(() => {
                navigateTo();
            }, 2000);
        }
    };

    const calcNewAppointmentInOneWeek = useCallback(() => {
        const startDate = DateTime.fromISO(appointmentToCreate.date);
        const nextDate = startDate.plus({ days: 7 }).toISO();
        return nextDate;
    }, [appointmentToCreate.date]);

    return (
        <Box>
            <AppointmentForm errors={errors} appointmentsCount={appointmentsCount} />
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
            {appointmentToCreate.isRecurring && <WeeklyAppointments appointmentsCount={appointmentsCount} nextDate={calcNewAppointmentInOneWeek()} />}
            <Stack direction={isMobile ? 'column' : 'row'} space={3} my="3">
                <Button onPress={isCourseCreation ? handleCreateCourseAppointments : handleCreateAppointment} width={buttonWidth}>
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
