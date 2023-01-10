import { Box } from 'native-base';
import CalendarMonth from './CalendarMonth';

type YearProps = {
    year: string;
    appointments: any;
};

const CalendarYear: React.FC<YearProps> = ({ year, appointments }) => {
    return (
        <Box>
            {Object.entries(appointments).map((month) => {
                return <CalendarMonth year={year} month={month[0]} appointments={month[1]} />;
            })}
        </Box>
    );
};

export default CalendarYear;
