import { Box, HStack, useBreakpointValue } from 'native-base';
import { getCourseTimeText, isCourseTakingPlaceRightNow, isCurrentMonth } from '../../helper/appointment-helper';
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
    const isCurrent = isCourseTakingPlaceRightNow(courseStart, duration);
    const currentMonth = isCurrentMonth(courseStart);

    const width = useBreakpointValue({
        base: '80%',
        lg: '100%',
    });

    const marginRef = useBreakpointValue({
        base: currentMonth ? 40 : 60,
        lg: currentMonth ? 40 : 60,
    });

    return (
        <>
            {scrollToRef ? (
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
            ) : (
                <Box w={width} mt={3}>
                    <HStack>
                        <AppointmentDate current={isCurrent} date={courseStart} />
                        <AppointmentTile
                            timeDescriptionText={getCourseTimeText(courseStart, duration)}
                            courseTitle={courseTitle}
                            isCurrentlyTakingPlace={isCurrent}
                        />
                    </HStack>
                </Box>
            )}
        </>
    );
};

export default Appointment;
