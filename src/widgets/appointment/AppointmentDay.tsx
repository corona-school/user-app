import { Box, HStack, useBreakpointValue, VStack } from 'native-base';
import { getCourseTimeText, isCourseNow, isCurrentMonth } from '../../helper/appointment-helper';
import AppointmentDate from './AppointmentDate';
import AppointmentTile from './AppointmentTile';

type Props = {
    first: boolean;
    courseStart: string;
    duration: number;
    courseTitle: string;
    instructors?: Instructor[];
    participants?: Participant[];
    scrollToRef?: any;

    onPressToAppointment: () => void;
};

type Instructor = {
    firstname: string;
    lastname: string;
};

type Participant = {
    firstname: string;
};

const AppointmentDay: React.FC<Props> = ({ first, courseStart, duration, courseTitle, instructors, participants, scrollToRef, onPressToAppointment }) => {
    const isCurrent = isCourseNow(courseStart, duration);
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
        <div ref={scrollToRef} key={courseStart} style={{ scrollMarginTop: marginRef }}>
            <Box w={width} mt={3}>
                <HStack>
                    <Box width="10" mr={3}>
                        {first && <AppointmentDate current={isCurrent} date={courseStart} />}
                    </Box>
                    <Box width="full">
                        <AppointmentTile
                            timeDescriptionText={getCourseTimeText(courseStart, duration)}
                            courseTitle={courseTitle}
                            isCurrentlyTakingPlace={isCurrent}
                            instructors={instructors}
                            participants={participants}
                            onPressToAppointment={onPressToAppointment}
                        />
                    </Box>
                </HStack>
            </Box>
        </div>
    );
};

export default AppointmentDay;
