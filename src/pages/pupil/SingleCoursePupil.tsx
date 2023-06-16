import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { DateTime } from 'luxon';
import { Heading, Row, Stack, Text, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs, { Tab } from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import PupilCourseButtons from './single-course/PupilCourseButtons';
import SubcourseData from '../subcourse/SubcourseData';
import { useMemo } from 'react';
import ParticipantRow from '../subcourse/ParticipantRow';
import PupilJoinedCourseBanner from '../../widgets/PupilJoinedCourseBanner';
import { getTrafficStatus } from '../../Utility';
import HelpNavigation from '../../components/HelpNavigation';
import { Subcourse } from '../../gql/graphql';

function OtherParticipants({ subcourseId }: { subcourseId: number }) {
    const { t } = useTranslation();
    const { data, loading } = useQuery(
        gql(`
        query GetOtherParticipants($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId){
                otherParticipants{
                    id
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
        groupChatType
        allowChatContactProspects
        allowChatContactParticipants
        alreadyPromoted @include(if: $isStudent)
        nextLecture{
            start
            duration
        }
        instructors{
            id
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
    }
}
`);

const SingleCoursePupil = () => {
    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);
    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const navigate = useNavigate();

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

    const [chatCreateForSubcourse, { loading: isLoadingChatCreation }] = useMutation(
        gql(`
            mutation createInstructorChat($memberUserId: String!) {
                participantChatCreate(participantUserId: $memberUserId)
            }       
        `)
    );

    async function contactInstructor() {
        const conversation = await chatCreateForSubcourse({ variables: { memberUserId: `student/${data?.subcourse?.instructors[0].id}` } });
        navigate('/chat', { state: { conversationId: conversation?.data?.participantChatCreate } });
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
                <>
                    {((subcourse?.lectures?.length ?? 0) > 0 &&
                        subcourse!.lectures.map((lecture, i) => (
                            <Row maxWidth={sizes['imageHeaderWidth']} flexDirection="column" marginBottom={space['1.5']}>
                                <Heading paddingBottom={space['0.5']} fontSize="md">
                                    {t('single.global.lesson')} {`${i + 1}`.padStart(2, '0')}
                                </Heading>
                                <Text paddingBottom={space['0.5']}>
                                    {DateTime.fromISO(lecture.start).toFormat('dd.MM.yyyy')}
                                    <Text marginX="3px">•</Text>
                                    {DateTime.fromISO(lecture.start).toFormat('HH:mm')} {t('single.global.clock')}
                                </Text>
                                <Text>
                                    <Text bold>{t('single.global.duration')}: </Text> {lecture?.duration / 60} {t('single.global.hours')}
                                </Text>
                            </Row>
                        ))) || <Text>{t('single.global.noLections')}</Text>}
                </>
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
        <WithNavigation
            headerTitle={course?.name.substring(0, 20)}
            showBack
            isLoading={loading}
            headerLeft={
                <Stack alignItems="center" direction="row">
                    <HelpNavigation />
                    <NotificationAlert />
                </Stack>
            }
        >
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
                        subcourse={subcourse as Subcourse}
                        canJoinSubcourse={canJoinData?.subcourse?.canJoin as any}
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
                        contactInstructor={contactInstructor}
                        refresh={refetch}
                    />
                )}
                <Tabs tabs={tabs} />
            </Stack>
        </WithNavigation>
    );
};

export default SingleCoursePupil;
