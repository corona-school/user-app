import { Box, HStack, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import { getCourseDate } from '../../helper/appointment-helper';
import AppointmentDate from './AppointmentDate';
import AppointmentTile from './AppointmentTile';

type Props = {
    courseStart: string;
    duration: number;
    courseTitle: string;
    courseInstructor: string;
};

const Appointment: React.FC<Props> = ({ courseStart, duration, courseTitle, courseInstructor }) => {
    const [isCurrent, setIsCurrent] = useState<boolean>(false);

    useEffect(() => {
        const currentOrNot = getCourseDate(courseStart, duration);
        setIsCurrent(currentOrNot.currentOrNot);
    }, [courseStart, duration]);

    const width = useBreakpointValue({
        base: '80%',
        lg: '90%',
    });

    return (
        <Box w={width} mt={3}>
            <HStack>
                <AppointmentDate current={isCurrent} date={courseStart} />
                <AppointmentTile
                    timeText={getCourseDate(courseStart, duration).timeText}
                    courseTitle={courseTitle}
                    courseInstructor={courseInstructor}
                    current={isCurrent}
                />
            </HStack>
        </Box>
    );
};

export default Appointment;
