import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { DateTime } from 'luxon';
import { Box, Heading, Row, Stack, Text, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs, { Tab } from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import { Lecture, Participant } from '../../gql/graphql';
import PupilCourseButtons from './single-course/PupilCourseButtons';
import SubcourseData from '../subcourse/SubcourseData';
import { useMemo } from 'react';
import ParticipantRow from '../subcourse/ParticipantRow';
import PupilJoinedCourseBanner from '../../widgets/PupilJoinedCourseBanner';
import { getTrafficStatus } from '../../Utility';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import { Appointment } from '../../types/lernfair/Appointment';

function OtherParticipants({ subcourseId }: { subcourseId: number }) {
    const { t } = useTranslation();
    const { data, loading } = useQuery(
        gql(`
        query GetOtherParticipants($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId){
                otherParticipants{
                    firstname
                    grade
                }
            }

            me { pupil { firstname lastname schooltype grade }}
        }
    `),
        { variables: { subcourseId } }
    );

    if (loading || !data) return <CenterLoadingSpinner />;

    const otherParticipants = data.subcourse!.otherParticipants;

    if (otherParticipants.length === 0) return <Text>{t('single.global.noMembers')}</Text>;

    return (
        <>
            <ParticipantRow participant={data.me.pupil as any} />
            {otherParticipants.map((participant) => (
                <ParticipantRow participant={participant} />
            ))}
        </>
    );
}

const singleSubcoursePupilQuery = gql(`
query GetSingleSubcoursePupil($subcourseId: Int!, $isStudent: Boolean = false) {
    subcourse(subcourseId: $subcourseId){
        id
        participantsCount
        maxParticipants
        minGrade
        maxGrade
        capacity
        alreadyPromoted @include(if: $isStudent)
        nextLecture{
            start
            duration
        }
        instructors{
            firstname
            lastname
        }
        course {
            id
            courseState
            name
            image
            category
            description
            subject
            tags{
            name
            }
            allowContact
        }
        lectures{
            start
            duration
        }
        canContactInstructor { allowed reason }
        isParticipant
        isOnWaitingList
        cancelled
        published
        appointments {
              id
              title
              description
              start
              duration
              position
              total
              organizers(skip: 0, take: 5) {
                id
                firstname
                lastname
              }
              participants(skip: 0, take: 50) {
                id
                firstname
                lastname
                isPupil
                isStudent
              }
            }
    }
}
`);

const SingleCoursePupil = () => {
    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);
    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const toast = useToast();

    const { data, loading, refetch } = useQuery(singleSubcoursePupilQuery, {
        variables: {
            subcourseId,
        },
    });

    const { subcourse } = data ?? {};
    const { course } = subcourse ?? {};

    const { data: canJoinData } = useQuery(
        gql(`
        query CanJoin($subcourseId: Int!) { 
            subcourse(subcourseId: $subcourseId) {
                canJoin { allowed reason }
            }
        }
    `),
        { variables: { subcourseId: subcourseId } }
    );

    const [joinSubcourse, { loading: loadingSubcourseJoined, data: joinedSubcourseData }] = useMutation(
        gql(`
            mutation SubcourseJoin($subcourseId: Float!) {
                subcourseJoin(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourseId },
        }
    );

    const [leaveSubcourse, { loading: loadingSubcourseLeft, data: leftSubcourseData }] = useMutation(
        gql(`
            mutation LeaveSubcourse($subcourseId: Float!) {
                subcourseLeave(subcourseId: $subcourseId)
            }
        `),
        { variables: { subcourseId: subcourseId } }
    );

    const [joinWaitingList, { data: joinedWaitinglist, loading: loadingJoinedWaitinglist }] = useMutation(
        gql(`
            mutation JoinWaitingList($subcourseId: Float!) {
                subcourseJoinWaitinglist(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourseId },
        }
    );

    const [leaveWaitingList, { data: leftWaitinglist, loading: loadingLeftWaitinglist }] = useMutation(
        gql(`
            mutation LeaveWaitingList($subcourseId: Float!) {
                subcourseLeaveWaitinglist(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourseId },
        }
    );

    const [contact, { loading: loadingContactInstructor }] = useMutation(
        gql(`
        mutation NotifyInstructors($subcourseId: Int!, $title: String!, $body: String!, $fileIDs: [String!]!) {
            subcourseNotifyInstructor(subcourseId: $subcourseId fileIDs: $fileIDs title: $title body: $body)
        }
    `)
    );

    async function doContact(title: string, body: string, fileIDs: string[]) {
        await contact({ variables: { subcourseId, title, body, fileIDs } });
        toast.show({ description: 'Benachrichtigung verschickt', placement: 'top' });
    }

    const courseFull = (subcourse?.participantsCount ?? 0) >= (subcourse?.maxParticipants ?? 0);

    const isInPast = useMemo(
        () =>
            !subcourse ||
            subcourse.lectures.every((lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis()),
        [subcourse]
    );

    const tabs: Tab[] = [
        {
            title: t('single.tabs.description'),
            content: (
                <>
                    <Text maxWidth={sizes['imageHeaderWidth']} marginBottom={space['1']}>
                        {course?.description}
                    </Text>
                </>
            ),
        },
        {
            title: t('single.tabs.lessons'),
            content: (
                <Box minH={300}>
                    <AppointmentList isReadOnlyList appointments={data?.subcourse?.appointments as Appointment[]} />
                </Box>
            ),
        },
    ];

    if (subcourse?.isParticipant) {
        tabs.push({
            title: t('single.tabs.participant'),
            content: (
                <>
                    <OtherParticipants subcourseId={subcourseId} />
                </>
            ),
        });
    }

    return (
        <WithNavigation headerTitle={course?.name.substring(0, 20)} showBack isLoading={loading} headerLeft={<NotificationAlert />}>
            <Stack space={space['2']} paddingX={space['1.5']}>
                {course && subcourse && <SubcourseData course={course} subcourse={subcourse} isInPast={isInPast} />}
                {subcourse?.isParticipant && !isInPast && (
                    <PupilJoinedCourseBanner
                        courseStatus={getTrafficStatus(subcourse?.participantsCount, subcourse?.maxParticipants)}
                        seatsLeft={subcourse?.maxParticipants - subcourse?.participantsCount}
                    />
                )}

                {course && subcourse && !isInPast && (
                    <PupilCourseButtons
                        courseFull={courseFull}
                        subcourse={subcourse}
                        canJoinSubcourse={canJoinData?.subcourse?.canJoin}
                        joinedSubcourse={joinedSubcourseData?.subcourseJoin}
                        joinedWaitinglist={joinedWaitinglist?.subcourseJoinWaitinglist}
                        leftSubcourseData={leftSubcourseData?.subcourseLeave}
                        leftWaitinglist={leftWaitinglist?.subcourseLeaveWaitinglist}
                        loadingSubcourseJoined={loadingSubcourseJoined}
                        loadingSubcourseLeft={loadingSubcourseLeft}
                        loadingJoinedWaitinglist={loadingJoinedWaitinglist}
                        loadingWaitinglistLeft={loadingLeftWaitinglist}
                        loadingContactInstructor={loadingContactInstructor}
                        joinSubcourse={() => joinSubcourse()}
                        leaveSubcourse={() => leaveSubcourse()}
                        joinWaitinglist={() => joinWaitingList()}
                        leaveWaitinglist={() => leaveWaitingList()}
                        doContactInstructor={doContact}
                        refresh={refetch}
                    />
                )}
                <Tabs tabs={tabs} />
            </Stack>
        </WithNavigation>
    );
};

export default SingleCoursePupil;
