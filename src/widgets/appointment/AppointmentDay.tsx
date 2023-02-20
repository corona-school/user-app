import { Box, HStack, useBreakpointValue, VStack } from 'native-base';
import { getCourseTimeText, isCourseNow, isCurrentMonth } from '../../helper/appointment-helper';
import AppointmentDate from './AppointmentDate';
import AppointmentTile from './AppointmentTile';

type Props = {
    first?: boolean;
    courseStart: string;
    duration: number;
    courseTitle: string;
    instructors?: Instructor[];
    participants?: Participant[];
    scrollToRef?: any;
    isReadOnly?: boolean;
    onPress: () => void;
};

type Instructor = {
    firstname: string;
    lastname: string;
};

type Participant = {
    firstname: string;
    lastname: string;
};

const AppointmentDay: React.FC<Props> = ({ first, courseStart, duration, courseTitle, instructors, participants, scrollToRef, isReadOnly, onPress }) => {
    const isCurrent = isCourseNow(courseStart, duration);
    const currentMonth = isCurrentMonth(courseStart);

    const width = useBreakpointValue({
        base: '80%',
        lg: '100%',
    });

    return (
        <>
            {!isReadOnly ? (
                <div key={courseStart} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 40 : 60 }}>
                    <Box w={width} mt={3}>
                        <HStack>
                            <AppointmentDate current={isCurrent} date={courseStart} />
                            <AppointmentTile
                                timeDescriptionText={getCourseTimeText(courseStart, duration)}
                                courseTitle={courseTitle}
                                isCurrentlyTakingPlace={isCurrent}
                                instructors={instructors}
                                participants={participants}
                                isReadOnly={isReadOnly}
                                onPress={onPress}
                            />
                        </HStack>
                    </Box>
                </div>
            ) : (
                <div key={courseStart} ref={scrollToRef} style={{ scrollMarginTop: 5 }}>
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
                </div>
            )}
        </>
    );
};

export default AppointmentDay;
