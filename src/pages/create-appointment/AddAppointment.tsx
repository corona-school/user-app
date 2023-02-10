import { Box, Button, Checkbox, Stack, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import RepeatWeekly from './RepeatWeekly';
import AppointmentForm from './AppointmentForm';
import { DateTime } from 'luxon';
import { gql, useMutation } from '@apollo/client';
import useApollo from '../../hooks/useApollo';
import { useCreateAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { AppointmentType, FormReducerActionType, Weeklies } from '../../context/CreateAppointment';

// type of appointments to send to the BE
type CreateAppointment = {
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number;
    organizers?: number[];
    participants_pupil?: number[];
    participants_student?: number[];
    participants_screener?: number[];
    appointmentType?: AppointmentType;
};

type CreateAppointmentWeekly = {
    baseAppointment: CreateAppointment;
    weeklyText: Weeklies;
};

export type StartDate = {
    date: string;
    time: string;
};

type AddProps = {
    next: () => void;
    back: () => void;
};

const AddAppointment: React.FC<AddProps> = ({ next, back }) => {
    const { user } = useApollo();
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointments();
    const { weeklies, dispatchWeeklyAppointment } = useWeeklyAppointments();

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

    const handleWeeklyCheck = () => {
        dispatchCreateAppointment({
            type: FormReducerActionType.TOGGLE_CHANGE,
            field: 'isRecurring',
        });
    };

    const handleCreateAppointment = () => {
        if (!appointmentToCreate) return;
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

        console.log('create appointment/s', newAppointment);
    };

    const handleCreateAppointmentWeekly = () => {};

    return (
        <Box>
            <AppointmentForm />
            <Box py="8">
                <Checkbox
                    _checked={{ backgroundColor: 'danger.900' }}
                    onChange={() => handleWeeklyCheck()}
                    value={appointmentToCreate.isRecurring ? 'true' : 'false'}
                >
                    {t('appointment.create.weeklyRepeat')}
                </Checkbox>
            </Box>
            {appointmentToCreate.isRecurring === true && <RepeatWeekly length={5} />}
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

export default AddAppointment;
