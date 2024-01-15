import { Box, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import Tabs from '../../components/Tabs';
import { gql } from './../../gql';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus } from '../../Utility';
import { DateTime } from 'luxon';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import GroupTile from '../../widgets/GroupTile';
import MatchTile from '../../widgets/MatchTile';

type AssignmentProps = {
    next: (id: number, isCourse?: boolean) => void;
    skipStepTwo: (id: number, isCourse?: boolean) => void;
};

const query = gql(`
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
`);

const AppointmentAssignment: React.FC<AssignmentProps> = ({ next, skipStepTwo }) => {
    const { data, loading } = useQuery(query);
    const { t } = useTranslation();
    const activeMatches = useMemo(() => data?.me?.student?.matches.filter((match) => !match.dissolved), [data?.me?.student?.matches]);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    const CardGrid = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    const publishedSubcourses = useMemo(
        () => data?.me?.student?.subcoursesInstructing.filter((sub) => sub.published),
        [data?.me?.student?.subcoursesInstructing]
    );

    const subcoursesToShow = useMemo(() => {
        if (!publishedSubcourses) return [];

        const sortedCourses = publishedSubcourses.sort((a, b) => {
            if (!b.firstLecture) return -1;
            if (!a.firstLecture) return 1;
            const aInMillis = DateTime.fromISO(a.firstLecture.start).toMillis();
            const bInMillis = DateTime.fromISO(b.firstLecture.start).toMillis();
            return bInMillis - aInMillis;
        });

        const coursesWitoutLectures = sortedCourses.filter((course) => course.lectures.length === 0);
        const coursesWithLectures = sortedCourses.filter((course) => course.lectures.length > 0);

        const coursesNewerThanThirtyDays = coursesWithLectures.filter((course) => {
            const lastLecture = course.lectures[course.lectures.length - 1];

            if (lastLecture) {
                const daysDiffFromNow = DateTime.fromISO(lastLecture.start).diffNow('days').days;
                return daysDiffFromNow > -30;
            }
            return false;
        });

        const coursesToShow = coursesNewerThanThirtyDays.concat(coursesWitoutLectures);

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
                                    <Stack direction={isMobile ? 'column' : 'row'} flexWrap="wrap">
                                        {activeMatches &&
                                            activeMatches.map((match, index) => {
                                                return (
                                                    <Box width={CardGrid} paddingRight="10px" marginBottom="10px" key={match.id}>
                                                        <MatchTile
                                                            key={match.id}
                                                            matchId={match.id}
                                                            schooltype={match?.pupil?.schooltype}
                                                            grade={match?.pupil?.grade || ''}
                                                            pupil={{ firstname: match?.pupil?.firstname || '', lastname: match?.pupil?.lastname || '' }}
                                                            subjects={match?.pupil?.subjectsFormatted.map((subject: { name: string }) => subject.name)}
                                                            next={match.appointments && match.appointments.length === 0 ? skipStepTwo : next}
                                                        />
                                                    </Box>
                                                );
                                            })}
                                    </Stack>
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
                                    subcoursesToShow.map((subcourse) => {
                                        const thisSubcourse = subcourse as LFSubCourse;
                                        const first = subcourse.firstLecture;
                                        return (
                                            <GroupTile
                                                key={subcourse.id}
                                                courseId={subcourse.id || 0}
                                                start={first && first.start}
                                                courseTitle={subcourse.course.name}
                                                tags={thisSubcourse.course.tags}
                                                courseStatus={getTrafficStatus(thisSubcourse?.participantsCount || 0, thisSubcourse?.maxParticipants || 0)}
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
