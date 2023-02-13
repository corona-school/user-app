import { Box, Button, Checkbox, Stack, useBreakpointValue, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import WeeklyAppointments from './WeeklyAppointments';
import AppointmentForm from './AppointmentForm';
import { DateTime } from 'luxon';
import { gql, useMutation } from '@apollo/client';
import useApollo from '../../hooks/useApollo';
import { useCreateAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { AppointmentType, FormReducerActionType } from '../../context/CreateAppointment';
import { CreateAppointment } from '../../types/lernfair/Appointment';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// type of appointments to send to the BE
export type StartDate = {
    date: string;
    time: string;
};

type Props = {
    back: () => void;
};

const AppointmentCreation: React.FC<Props> = ({ back }) => {
    const [error, setError] = useState({});
    const { user } = useApollo();
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointments();
    const { weeklies } = useWeeklyAppointments();
    const navigate = useNavigate();
    const toast = useToast();

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '20%',
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

    const validate = () => {
        if (appointmentToCreate.title.length === 0) {
            setError({ ...error, title: 'Title darf nicht leer sein' });
            return false;
        }
        if (!appointmentToCreate.date) {
            setError({ ...error, date: 'Datum darf nicht leer sein' });
            return false;
        }
        if (!appointmentToCreate.time.length) {
            setError({ ...error, time: 'Zeit darf nicht leer sein' });
            return false;
        }
        if (appointmentToCreate.duration === 0) {
            setError({ ...error, duration: 'Dauer darf nicht leer sein' });
            return false;
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
        validate() ? console.log('valid inputs') : console.log('there is an error');
        const start = convertStartDate(appointmentToCreate.date, appointmentToCreate.time);

        // TODO add subcourseId or matchId
        const newAppointment: CreateAppointment = {
            title: appointmentToCreate.title,
            description: appointmentToCreate.description,
            start: start,
            organizers: [user!.student!.id],
            duration: appointmentToCreate.duration,
            appointmentType: AppointmentType.GROUP,
        };

        // createAppointment({ variables: { newAppointment } });;
        validate() && toast.show({ description: 'Termine hinzugefügt', placement: 'top' });
        validate() &&
            setTimeout(() => {
                navigate('/appointments');
            }, 2000);
    };

    const handleCreateAppointmentWeekly = () => {
        if (!appointmentToCreate) return;
        validate() ? console.log('valid inputs') : console.log('there is an error');
        const start = convertStartDate(appointmentToCreate.date, appointmentToCreate.time);
        const baseAppointment = {
            title: appointmentToCreate.title,
            description: appointmentToCreate.description,
            start: start,
            duration: appointmentToCreate.duration,
            subcourseId: 1,
        };
        const weeklyTexts = weeklies;

        // createAppointmentWithWeeklies({variables: {baseAppointment, weeklyTexts}})
        console.log('create appointment with weeklies', baseAppointment, weeklyTexts);

        toast.show({ description: 'Termine hinzugefügt', placement: 'top' });
        setTimeout(() => {
            navigate('/appointments');
        }, 2000);
    };

    return (
        <Box>
            <AppointmentForm errors={error} />
            <Box py="8">
                <Checkbox
                    _checked={{ backgroundColor: 'danger.900' }}
                    onChange={() => handleWeeklyCheck()}
                    value={appointmentToCreate.isRecurring ? 'true' : 'false'}
                >
                    {t('appointment.create.weeklyRepeat')}
                </Checkbox>
            </Box>
            {appointmentToCreate.isRecurring && <WeeklyAppointments length={5} />}
            <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3} my="3">
                <Button onPress={appointmentToCreate.isRecurring ? handleCreateAppointmentWeekly : handleCreateAppointment} width={buttonWidth}>
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
