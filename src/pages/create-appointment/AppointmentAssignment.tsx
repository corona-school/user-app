import { Box, Text, VStack } from 'native-base';
import Tabs from '../../components/Tabs';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { LFMatch } from '../../types/lernfair/Match';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus } from '../../Utility';
import { DateTime } from 'luxon';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import MatchTile from '../../widgets/appointment/create-appointment/MatchTile';
import GroupTile from '../../widgets/appointment/create-appointment/GroupTile';

type AssignmentProps = {
    next: (id: number, isCourse?: boolean) => void;
    skipStepTwo: (id: number, isCourse?: boolean) => void;
};

const query = gql`
    query StudentCourseMatches {
        me {
            firstname
            student {
                matches {
                    id
                    uuid
                    dissolved
                    pupil {
                        firstname
                        lastname
                        schooltype
                        grade
                        subjectsFormatted {
                            name
                        }
                    }
                    pupilEmail
                    appointments {
                        id
                    }
                }
                subcoursesInstructing {
                    id
                    published
                    lectures {
                        start
                        duration
                    }
                    firstLecture {
                        id
                        start
                        duration
                    }
                    course {
                        name
                        description
                        tags {
                            name
                        }
                    }
                }
            }
        }
    }
`;

const AppointmentAssignment: React.FC<AssignmentProps> = ({ next, skipStepTwo }) => {
    const { data, loading } = useQuery(query);
    const { t } = useTranslation();
    const activeMatches = useMemo(() => data?.me?.student?.matches.filter((match: LFMatch) => !match.dissolved), [data?.me?.student?.matches]);

    const publishedSubcourses = useMemo(
        () => data?.me?.student?.subcoursesInstructing.filter((sub: LFSubCourse) => sub.published),
        [data?.me?.student?.subcoursesInstructing]
    );

    // sorted courses should come from BE
    const subcoursesToShow = useMemo(() => {
        if (!publishedSubcourses) return [];

        const sortedCourses: LFSubCourse[] = publishedSubcourses.sort((a: LFSubCourse, b: LFSubCourse) => {
            if (!b.firstLecture) return -1;
            if (!a.firstLecture) return 1;
            const aInMillis = DateTime.fromISO(a.firstLecture.start).toMillis();
            const bInMillis = DateTime.fromISO(b.firstLecture.start).toMillis();
            return aInMillis - bInMillis;
        });

        const coursesWithLectures = sortedCourses.filter((course) => course.lectures.length > 0);
        const coursesWitoutLectures = sortedCourses.filter((course) => course.lectures.length === 0);
        let coursesNewerThanThirtyDays: LFSubCourse[] = coursesWithLectures;

        // should be done in BE
        for (const course of coursesWithLectures) {
            const lastLecture = course.lectures.length > 0 ? course.lectures[course.lectures.length - 1] : course.lectures[1];
            const daysDiffFromNow = DateTime.fromISO(lastLecture.start).diffNow('days').days;
            if (daysDiffFromNow < -30) {
                coursesNewerThanThirtyDays = coursesWithLectures.filter((c) => c.id !== course.id);
            }
        }
        const coursesToShow = coursesWitoutLectures.concat(coursesNewerThanThirtyDays);

        return coursesToShow;
    }, [publishedSubcourses]);

    return (
        <Box>
            <Box py={6}>
                <Text>{t('appointment.create.assignmentHeader')}</Text>
            </Box>
            <Tabs
                tabs={[
                    {
                        title: t('appointment.create.oneToOneTitle'),
                        content: (
                            <VStack space="4">
                                {loading ? (
                                    <CenterLoadingSpinner />
                                ) : (
                                    activeMatches &&
                                    activeMatches.map((match: LFMatch) => {
                                        return (
                                            <MatchTile
                                                key={match.id}
                                                matchId={match.id}
                                                schooltype={match?.pupil?.schooltype}
                                                grade={match?.pupil?.grade}
                                                pupil={{ firstname: match?.pupil?.firstname, lastname: match?.pupil?.lastname }}
                                                subjects={match?.pupil?.subjectsFormatted.map((subject: { name: string }) => subject.name)}
                                                next={match.appointments && match.appointments.length === 0 ? skipStepTwo : next}
                                            />
                                        );
                                    })
                                )}
                            </VStack>
                        ),
                    },
                    {
                        title: t('appointment.create.group'),
                        content: (
                            <VStack space="4">
                                {loading ? (
                                    <CenterLoadingSpinner />
                                ) : (
                                    subcoursesToShow.length > 0 &&
                                    subcoursesToShow.map((subcourse: LFSubCourse) => {
                                        const first = subcourse.firstLecture;
                                        return (
                                            <GroupTile
                                                key={subcourse.id}
                                                courseId={subcourse.id || 0}
                                                start={first && first.start}
                                                courseTitle={subcourse.course.name}
                                                tags={subcourse.course.tags}
                                                courseStatus={getTrafficStatus(subcourse?.participantsCount || 0, subcourse?.maxParticipants || 0)}
                                                next={subcourse.lectures.length === 0 ? skipStepTwo : next}
                                            />
                                        );
                                    })
                                )}
                            </VStack>
                        ),
                    },
                ]}
            ></Tabs>
        </Box>
    );
};

export default AppointmentAssignment;
