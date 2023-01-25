import { Box, Text, VStack } from 'native-base';
import Tabs from '../../components/Tabs';
import AssignmentTile from '../../widgets/appointment/AssignmentTile';
import { gql, useQuery } from '@apollo/client';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { LFMatch } from '../../types/lernfair/Match';
import { LFLecture, LFSubCourse } from '../../types/lernfair/Course';
import { getFirstLectureFromSubcourse, getTrafficStatus } from '../../Utility';
import { DateTime } from 'luxon';

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

//Kurse, deren letzter Termin länger als 30 Tage her ist werden nicht mehr angezeigt
const AppointmentAssignment = () => {
    const { data, loading, called } = useQuery(query);
    const { t } = useTranslation();

    const activeMatches = useMemo(() => data?.me?.student?.matches.filter((match: LFMatch) => !match.dissolved), [data?.me?.student?.matches]);

    const publishedSubcourses = useMemo(
        () => data?.me?.student?.subcoursesInstructing.filter((sub: LFSubCourse) => sub.published),
        [data?.me?.student?.subcoursesInstructing]
    );

    const sortedPublishedSubcourses = useMemo(() => {
        if (!publishedSubcourses) return [];

        const sortedCourses: LFSubCourse[] = publishedSubcourses.sort((a: LFSubCourse, b: LFSubCourse) => {
            const aLecture = getFirstLectureFromSubcourse(a.lectures);
            const bLecture = getFirstLectureFromSubcourse(b.lectures);

            if (bLecture === null) return -1;
            if (aLecture === null) return 1;

            const aDate = DateTime.fromISO(aLecture.start).toMillis();
            const bDate = DateTime.fromISO(bLecture.start).toMillis();

            if (aDate < DateTime.now().toMillis()) return 1;
            if (bDate < DateTime.now().toMillis()) return 1;

            if (aDate === bDate) return 0;
            return aDate > bDate ? 1 : -1;
        });

        //Kurse, deren letzter Termin länger als 30 Tage her ist werden nicht mehr angezeigt
        for (const course of sortedCourses) {
            const lastLecture = course.lectures[course.lectures.length - 1];
            const now = DateTime.now();

            // if (date < now) {
            //     console.log('past lecture');
            // }
            console.log('last course lecture', lastLecture);
        }

        return sortedCourses;
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
                                {activeMatches &&
                                    activeMatches.map((match: LFMatch, index: number) => {
                                        return (
                                            <AssignmentTile
                                                isGroup={false}
                                                schooltype={match?.pupil?.schooltype}
                                                grade={match?.pupil?.grade}
                                                pupil={{ firstname: match?.pupil?.firstname, lastname: match?.pupil?.lastname }}
                                                subjects={match?.pupil?.subjectsFormatted.map((subject: { name: string }) => subject.name)}
                                            />
                                        );
                                    })}
                            </VStack>
                        ),
                    },
                    {
                        title: 'Gruppe',
                        content: (
                            <VStack space="4">
                                {sortedPublishedSubcourses.length > 0 &&
                                    sortedPublishedSubcourses.map((subcourse: LFSubCourse, index: number) => {
                                        const firstLecture = getFirstLectureFromSubcourse(subcourse.lectures);
                                        if (!firstLecture) return <></>;

                                        console.log();
                                        return (
                                            <AssignmentTile
                                                isGroup={true}
                                                startDate={firstLecture.start}
                                                courseTitle={subcourse.course.name}
                                                tags={subcourse.course.tags}
                                                courseStatus={getTrafficStatus(subcourse?.participantsCount || 0, subcourse?.maxParticipants || 0)}
                                            />
                                        );
                                    })}
                            </VStack>
                        ),
                    },
                ]}
            ></Tabs>
        </Box>
    );
};

export default AppointmentAssignment;
