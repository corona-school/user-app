import { DateTime } from 'luxon';
import { Box, HStack, useBreakpointValue } from 'native-base';
import { useCallback } from 'react';
import { getI18n } from 'react-i18next';
import { Student } from '../../gql/graphql';
import { Participant } from '../../types/lernfair/User';
import AppointmentDate from './AppointmentDate';
import AppointmentTile from './AppointmentTile';

type Props = {
    courseStart: string;
    duration: number;
    courseTitle: string;
    organizers?: Student[];
    participants?: Participant[];
    scrollToRef?: any;
    isReadOnly?: boolean;
    onPress: () => void;
};

const AppointmentDay: React.FC<Props> = ({ courseStart, duration, courseTitle, organizers, participants, scrollToRef, isReadOnly, onPress }) => {
    const isCurrentMonth = useCallback((courseStart: string): boolean => {
        const now = DateTime.now();
        const start = DateTime.fromISO(courseStart);
        const sameMonth = now.hasSame(start, 'month');
        const sameYear = now.hasSame(start, 'year');
        if (sameMonth && sameYear) return true;
        return false;
    }, []);

    const isCourseNow = (courseStart: string, duration: number): boolean => {
        const now = DateTime.now();
        const start = DateTime.fromISO(courseStart);
        const end = start.plus({ minutes: duration });

        return start <= now && now < end;
    };

    const getCourseTimeText = (courseStart: string, duration: number): string => {
        const now = DateTime.now();
        const start = DateTime.fromISO(courseStart);
        const end = start.plus({ minutes: duration });

        const startTime = start.setLocale('de-DE').toFormat('T');
        const endTime = end.setLocale('de-DE').toFormat('T');
        const i18n = getI18n();

        if (start <= now && now < end) {
            return i18n.t('appointment.clock.nowToEnd', { end: endTime });
        }
        return i18n.t('appointment.clock.startToEnd', { start: startTime, end: endTime });
    };

    const isCurrent = isCourseNow(courseStart, duration);
    const currentMonth = isCurrentMonth(courseStart);

    const width = useBreakpointValue({
        base: '80%',
        lg: '100%',
    });

    return (
        <>
            {!isReadOnly ? (
                <div key={courseStart} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 5 : 10 }}>
                    <Box w={width} mt={3}>
                        <HStack>
                            <AppointmentDate current={isCurrent} date={courseStart} />
                            <AppointmentTile
                                timeDescriptionText={getCourseTimeText(courseStart, duration)}
                                courseTitle={courseTitle}
                                isCurrentlyTakingPlace={isCurrent}
                                organizers={organizers}
                                participants={participants}
                                isReadOnly={isReadOnly}
                                onPress={onPress}
                            />
                        </HStack>
                    </Box>
                </div>
            ) : (
                <div key={courseStart} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 5 : 10 }}>
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
