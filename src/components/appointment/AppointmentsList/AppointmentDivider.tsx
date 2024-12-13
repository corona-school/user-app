import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { Appointment } from '@/types/lernfair/Appointment';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

interface AppointmentDividerProps {
    index: number;
    appointments: Appointment[];
}

export const AppointmentDivider = ({ appointments, index }: AppointmentDividerProps) => {
    const { i18n } = useTranslation();
    const showWeekDivider = (currentAppointment: Appointment, previousAppointment?: Appointment) => {
        if (!previousAppointment) {
            return false;
        }

        const currentDate = DateTime.fromISO(currentAppointment.start);
        const previousDate = DateTime.fromISO(previousAppointment.start);
        return currentDate.year !== previousDate.year || currentDate.weekNumber !== previousDate.weekNumber;
    };

    const showMonthDivider = (currentAppointment: Appointment, previousAppointment?: Appointment) => {
        if (!previousAppointment) {
            return true;
        }

        const currentDate = DateTime.fromISO(currentAppointment.start);
        const previousDate = DateTime.fromISO(previousAppointment.start);
        return currentDate.month !== previousDate.month || currentDate.year !== previousDate.year;
    };
    const appointment = appointments[index];
    const previousAppointment = appointments[index - 1];
    const weekDivider = showWeekDivider(appointment, previousAppointment);
    const monthDivider = showMonthDivider(appointment, previousAppointment);
    if (weekDivider && !monthDivider) {
        return <Separator orientation="horizontal" decorative className="mb-8 mt-2 w-1/2 mx-auto" />;
    }
    if (monthDivider) {
        return (
            <Typography variant="h4" as="p" className="text-center mb-3">{`${DateTime.fromISO(appointment.start).setLocale(i18n.language).monthLong} ${
                DateTime.fromISO(appointment.start).year
            }`}</Typography>
        );
    }
    return null;
};
