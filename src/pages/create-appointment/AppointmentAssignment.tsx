import { Box, Text, VStack } from 'native-base';
import Tabs from '../../components/Tabs';
import AssignmentTile from '../../widgets/appointment/AssignmentTile';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { LFMatch } from '../../types/lernfair/Match';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus } from '../../Utility';
import { DateTime } from 'luxon';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { Assignment } from '../../types/lernfair/Appointment';

type AssignmentProps = {
    next: (id?: number) => void;
    back: () => void;
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
                }
                subcoursesInstructing {
                    id
                    participantsCount
                    maxParticipants
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

const AppointmentAssignment: React.FC<AssignmentProps> = ({ next, back }) => {
    const { data, loading } = useQuery(query);
    const { t } = useTranslation();

    const activeMatches = useMemo(() => data?.me?.student?.matches.filter((match: LFMatch) => !match.dissolved), [data?.me?.student?.matches]);

    const publishedSubcourses = useMemo(
        () => data?.me?.student?.subcoursesInstructing.filter((sub: LFSubCourse) => sub.published),
        [data?.me?.student?.subcoursesInstructing]
    );

    const subcoursesToShow = useMemo(() => {
        if (!publishedSubcourses) return [];

        const sortedCourses: LFSubCourse[] = publishedSubcourses.sort((a: LFSubCourse, b: LFSubCourse) => {
            const aLecture = a.firstLecture;
            const bLecture = b.firstLecture;

            if (!bLecture) return -1;
            if (!aLecture) return 1;

            const aDate = DateTime.fromISO(aLecture.start).toMillis();
            const bDate = DateTime.fromISO(bLecture.start).toMillis();

            if (aDate < DateTime.now().toMillis()) return 1;
            if (bDate < DateTime.now().toMillis()) return 1;

            if (aDate === bDate) return 0;
            return aDate > bDate ? 1 : -1;
        });

        const coursesWithLectures = sortedCourses.filter((course) => course.lectures.length > 0);
        const coursesWitoutLectures = sortedCourses.filter((course) => course.lectures.length === 0);
        let coursesNewerThanThirtyDays: LFSubCourse[] = coursesWithLectures;

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
                <Text>{t('appointment.createAppointment.assignment.header')}</Text>
            </Box>
            <Tabs
                tabs={[
                    {
                        title: 'Einzel',
                        content: (
                            <VStack space="4">
                                {loading ? (
                                    <CenterLoadingSpinner />
                                ) : (
                                    activeMatches &&
                                    activeMatches.map((match: LFMatch, index: number) => {
                                        return (
                                            <AssignmentTile
                                                key={`match ${index}`}
                                                type={Assignment.MATCH}
                                                schooltype={match?.pupil?.schooltype}
                                                grade={match?.pupil?.grade}
                                                pupil={{ firstname: match?.pupil?.firstname, lastname: match?.pupil?.lastname }}
                                                subjects={match?.pupil?.subjectsFormatted.map((subject: { name: string }) => subject.name)}
                                                next={next}
                                            />
                                        );
                                    })
                                )}
                            </VStack>
                        ),
                    },
                    {
                        title: 'Gruppe',
                        content: (
                            <VStack space="4">
                                {loading ? (
                                    <CenterLoadingSpinner />
                                ) : (
                                    subcoursesToShow.length > 0 &&
                                    subcoursesToShow.map((subcourse: LFSubCourse, index: number) => {
                                        const first = subcourse.firstLecture;
                                        if (!first)
                                            return (
                                                <AssignmentTile
                                                    key={`no-appointments-${index}`}
                                                    type={Assignment.GROUP}
                                                    courseTitle={subcourse.course.name}
                                                    tags={subcourse.course.tags}
                                                    courseStatus={getTrafficStatus(subcourse?.participantsCount || 0, subcourse?.maxParticipants || 0)}
                                                    next={next}
                                                />
                                            );
                                        return (
                                            <AssignmentTile
                                                key={`course-${index}`}
                                                courseId={subcourse.id}
                                                type={Assignment.GROUP}
                                                startDate={first.start}
                                                courseTitle={subcourse.course.name}
                                                tags={subcourse.course.tags}
                                                courseStatus={getTrafficStatus(subcourse?.participantsCount || 0, subcourse?.maxParticipants || 0)}
                                                next={next}
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
