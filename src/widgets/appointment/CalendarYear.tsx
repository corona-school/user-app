import { Box } from 'native-base';
import CalendarMonth from './CalendarMonth';

type YearProps = {
    year: number;
    appointments: any;
};

const CalendarYear: React.FC<YearProps> = ({ year, appointments }) => {
    return (
        <Box>
            {Object.entries(appointments).map((month) => {
                return <CalendarMonth year={Number(year)} month={Number(month[0])} appointments={month[1]} />;
            })}
        </Box>
    );
};

export default CalendarYear;
