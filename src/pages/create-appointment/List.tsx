import { Box, ScrollView } from 'native-base';
import { useMemo } from 'react';
import appointments from '../../widgets/appointment/dummy/appointments';
import CalendarYear from '../../widgets/appointment/list/CalendarYear';

type ListProps = {
    appointments?: any;
};
const List: React.FC<ListProps> = () => {
    const allAppointments = appointments.monthAppointments;

    const appointmentsForOneYear = useMemo(() => Object.entries(allAppointments), [allAppointments]);
    const yearIndex = 0;
    const appointmentsIndex = 1;

    return (
        <ScrollView ml={3} width={'100%'} pl={3}>
            {appointmentsForOneYear.map((yearEntries) => {
                const year = Number(yearEntries[yearIndex]);
                const appointmentsInYear = yearEntries[appointmentsIndex];
                return <CalendarYear key={year} year={year} appointmentsOfYear={appointmentsInYear} />;
            })}
        </ScrollView>
    );
};

export default List;
