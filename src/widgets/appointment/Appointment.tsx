import { DateTime } from 'luxon';
import { Box, HStack, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import { getCourseTimeText, isCourseTakingPlaceRightNow } from '../../helper/appointment-helper';
import AppointmentDate from './AppointmentDate';
import AppointmentTile from './AppointmentTile';

type Props = {
    courseStart: string;
    duration: number;
    courseTitle: string;
    instructors?: Instructor[];
    participants?: Participant[];
    scrollToRef?: any;
    key: React.Key;
};

type Instructor = {
    firstname: string;
    lastname: string;
};

type Participant = {
    firstname: string;
};

const Appointment: React.FC<Props> = ({ courseStart, duration, courseTitle, instructors, participants, scrollToRef }) => {
    const [isCurrent, setIsCurrent] = useState<boolean>(false);

    // TODO we have to update the effect more often so that if a course will get "current" the UI changes
    useEffect(() => {
        setIsCurrent(isCourseTakingPlaceRightNow(courseStart, duration));
    }, [courseStart, duration]);

    const width = useBreakpointValue({
        base: '80%',
        lg: '100%',
    });

    // TODO add to helper functions
    const isCurrentMonth = () => {
        const currentMonth = DateTime.now().month;
        const month = DateTime.fromISO(courseStart).month;
        if (currentMonth === month) return true;
        return false;
    };

    const marginRef = useBreakpointValue({
        base: isCurrentMonth() ? 40 : 100,
        lg: isCurrentMonth() ? 40 : 100,
    });

    return (
        <div ref={scrollToRef} key={courseStart} style={{ scrollMarginTop: marginRef }}>
            <Box w={width} mt={3}>
                <HStack>
                    <AppointmentDate current={isCurrent} date={courseStart} />
                    <AppointmentTile
                        timeDescriptionText={getCourseTimeText(courseStart, duration)}
                        courseTitle={courseTitle}
                        isCurrentlyTakingPlace={isCurrent}
                        instructors={instructors}
                        participants={participants}
                    />
                </HStack>
            </Box>
        </div>
    );
};

export default Appointment;
