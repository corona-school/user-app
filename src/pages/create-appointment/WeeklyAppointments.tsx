import { DateTime } from 'luxon';
import { VStack } from 'native-base';
import { useCallback } from 'react';
import { useWeeklyAppointments } from '../../context/AppointmentContext';
import AddWeeklyAppointmentButton from '../../widgets/AddWeeklyAppointmentButton';
import WeeklyAppointmentForm from './WeeklyAppointmentForm';

type WeeklyProps = {
    appointmentsCount: number;
    nextDate: string;
};

const WeeklyAppointments: React.FC<WeeklyProps> = ({ appointmentsCount, nextDate }) => {
    const { weeklies } = useWeeklyAppointments();

    const calcNewAppointmentInOneWeek = (date: string) => {
        const startDate = DateTime.fromISO(date);
        const nextDate = startDate.plus({ days: 7 }).toISO();
        return nextDate;
    };

    const getNextSuffix = useCallback(() => {
        if (weeklies.length === 0) return appointmentsCount + 1;
        return appointmentsCount + 1 + weeklies.length;
    }, [appointmentsCount, weeklies.length]);

    return (
        <VStack space="5">
            {weeklies.map((w, idx) => (
                <WeeklyAppointmentForm key={idx} index={idx} isLast={idx === weeklies.length - 1} nextDate={nextDate} />
            ))}
            <AddWeeklyAppointmentButton
                length={getNextSuffix()}
                nextDate={weeklies.length === 0 ? nextDate : calcNewAppointmentInOneWeek(weeklies[weeklies.length - 1].nextDate)}
            />
        </VStack>
    );
};

export default WeeklyAppointments;
