import { Box, useBreakpointValue } from 'native-base';
import appointments from './dummy/appointments';
import CalendarYear from './CalendarYear';

const AppointmentList: React.FC = () => {
    const monthAppointments = appointments.monthAppointments;
    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

    return (
        <Box width={width}>
            {Object.entries(monthAppointments).map((year) => {
                return <CalendarYear year={Number(year[0])} appointments={year[1]} />;
            })}
        </Box>
    );
};

export default AppointmentList;
