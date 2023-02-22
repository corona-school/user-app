import { Box, Button, Checkbox, Stack, useBreakpointValue, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import WeeklyAppointments from './WeeklyAppointments';
import AppointmentForm from './AppointmentForm';
import { DateTime } from 'luxon';
import { gql, useMutation } from '@apollo/client';
import useApollo from '../../hooks/useApollo';
import { useCreateAppointment, useCreateAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { AppointmentType, FormReducerActionType } from '../../types/lernfair/CreateAppointment';
import { CreateAppointment } from '../../types/lernfair/Appointment';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';

type FormErrors = {
    title?: string;
    date?: string;
    time?: string;
    duration?: string;
    description?: string;
    dateNotInOneWeek?: string;
};

// type of appointments to send to the BE
export type StartDate = {
    date: string;
    time: string;
};

type Props = {
    back: () => void;
    isCourseAppointment?: boolean;
};

const AppointmentCreation: React.FC<Props> = ({ back, isCourseAppointment }) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointment();
    const { appointmentsToBeCreated, setAppointmentsToBeCreated } = useCreateAppointments();
    const { weeklies } = useWeeklyAppointments();
    const { user } = useApollo();
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const navigate = useNavigate();
    const toast = useToast();

    const appointmentsCount = 2;

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '25%',
    });

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

    const [createAppointments] = useMutation(gql`
        mutation createAppointments($appointments: [AppointmentCreateInputFull!]!) {
            appointmentsCreate(appointments: $appointments)
        }
    `);

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

    const handleCreateAppointments = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            const organizers = [user!.student!.id];

            const newAppointment: CreateAppointment = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                organizers: organizers,
                duration: appointmentToCreate.duration,
                appointmentType: AppointmentType.GROUP,
            };
            setAppointmentsToBeCreated([...appointmentsToBeCreated, newAppointment]);

            // if (weeklies.length > 0) {
            //     for (const weekly of weeklies) {
            //         appointmentsToCreate.push({
            //             title: weekly.title ? weekly.title : '',
            //             description: weekly.description ? weekly.description : '',
            //             start: weekly.nextDate,
            //             organizers: organizers,
            //             duration: appointmentToCreate.duration,
            //             appointmentType: AppointmentType.GROUP,
            //         });
            //     }
            // }

            // createAppointments({ variables: { appointmentsToBeCreated } });
            if (isCourseAppointment) navigate('/create-course', { state: { currentStep: 1, newCourseAppointments: true } });
            toast.show({ description: weeklies.length > 0 ? 'Termine hinzugefügt' : 'Termin hinzugefügt', placement: 'top' });
            setTimeout(() => {
                navigate('/appointments');
            }, 2000);
        }
        // console.log('appointments to create', appointmentsToCreate, 'is course appointment? ', isCourseAppointment);
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
                <Button onPress={handleCreateAppointments} width={buttonWidth}>
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
