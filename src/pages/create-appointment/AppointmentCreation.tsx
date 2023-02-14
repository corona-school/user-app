import { Box, Button, Checkbox, Stack, useBreakpointValue, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import WeeklyAppointments from './WeeklyAppointments';
import AppointmentForm from './AppointmentForm';
import { DateTime } from 'luxon';
import { gql, useMutation } from '@apollo/client';
import useApollo from '../../hooks/useApollo';
import { useCreateAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
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
};

const AppointmentCreation: React.FC<Props> = ({ back }) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointments();
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

    const [createAppointment] = useMutation(gql`
        mutation createAppointment($appointment: AppointmentCreateInputFull!) {
            appointmentCreate(appointment: $appointment)
        }
    `);

    const [createAppointmentWithWeeklies] = useMutation(gql`
        mutation createWeekly($baseAppointment: AppointmentCreateGroupInput!, $weeklyTexts: [AppointmentInputText!]!) {
            appointmentGroupWeeklyCreate(baseAppointment: $baseAppointment, weeklyTexts: $weeklyTexts)
        }
    `);

    const validateInputs = () => {
        const isDateMinOneWeekLater = (date: string): boolean => {
            const startDate = DateTime.fromISO(date);
            const diff = startDate.diffNow('days').days;
            if (diff >= 7) return true;
            return false;
        };

        if (!appointmentToCreate.title.length) {
            setErrors({ ...errors, title: 'Title darf nicht leer sein' });
            return false;
        } else {
            delete errors.title;
        }
        if (!appointmentToCreate.date) {
            setErrors({ ...errors, date: 'Datum darf nicht leer sein' });
            return false;
        } else {
            delete errors.date;
        }
        if (isDateMinOneWeekLater(appointmentToCreate.date) === false) {
            setErrors({ ...errors, dateNotInOneWeek: 'Datum muss in mind einer Woche sein' });
            return false;
        } else {
            delete errors.date;
        }
        if (!appointmentToCreate.time.length) {
            setErrors({ ...errors, time: 'Zeit darf nicht leer sein' });
            return false;
        } else {
            delete errors.time;
        }
        if (appointmentToCreate.duration === 0) {
            setErrors({ ...errors, duration: 'Dauer darf nicht leer sein' });
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
    const handleCreateAppointment = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            const start = convertStartDate(appointmentToCreate.date, appointmentToCreate.time);
            const organizers = [user!.student!.id];

            // TODO add subcourseId or matchId
            const newAppointment: CreateAppointment = {
                title: appointmentToCreate.title,
                description: appointmentToCreate.description,
                start: start,
                organizers: organizers,
                duration: appointmentToCreate.duration,
                appointmentType: AppointmentType.GROUP,
            };

            createAppointment({ variables: { newAppointment } });
            toast.show({ description: 'Termine hinzugefügt', placement: 'top' });
            setTimeout(() => {
                navigate('/appointments');
            }, 2000);
        } else {
            return;
        }
    };
    const handleCreateAppointmentWeekly = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            const start = convertStartDate(appointmentToCreate.date, appointmentToCreate.time);

            const baseAppointment = {
                title: appointmentToCreate.title,
                description: appointmentToCreate.description,
                start: start,
                duration: appointmentToCreate.duration,
                subcourseId: 1,
            };
            const weeklyTexts = weeklies;

            createAppointmentWithWeeklies({ variables: { baseAppointment, weeklyTexts } });
            toast.show({ description: 'Termine hinzugefügt', placement: 'top' });
            setTimeout(() => {
                navigate('/appointments');
            }, 2000);
        } else {
            return;
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
                <Button onPress={weeklies.length > 0 ? handleCreateAppointmentWeekly : handleCreateAppointment} width={buttonWidth}>
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
