import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { DateTime } from 'luxon';
import { Box, Stack, Text, useTheme, useToast } from 'native-base';
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
import AppointmentList from '../../widgets/AppointmentList';
import { Appointment } from '../../types/lernfair/Appointment';
import HelpNavigation from '../../components/HelpNavigation';
import { Subcourse } from '../../gql/graphql';
import { Lecture } from '../../gql/graphql';

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
query GetSingleSubcoursePupil($subcourseId: Int!) {
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
        canJoin {
            allowed
        }
        canContactInstructor { allowed reason }
        isParticipant
        isOnWaitingList
        cancelled
        published
        appointments {
              id
              appointmentType
              title
              description
              start
              duration
              displayName
              position
              total
              isOrganizer
              isParticipant
              subcourse {
                published
              }
              override_meeting_link
            }
    }
}
`);

const SingleCoursePupil = () => {
    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);
    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const toast = useToast();

    const { data, loading, refetch } = useQuery(singleSubcoursePupilQuery, {
        variables: {
            subcourseId,
        },
    });

    const { subcourse } = data ?? {};

    const { course } = subcourse ?? {};
    const appointments = subcourse?.appointments ?? [];

    const myNextAppointment = useMemo(() => appointments[0], [appointments]);
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

    const [chatCreateForSubcourse] = useMutation(
        gql(`
            mutation createInstructorChat($subcourseId: Float!, $memberUserId: String!) {
                participantChatCreate(subcourseId: $subcourseId, memberUserId: $memberUserId, )
            }       
        `)
    );

    const [chatCreateAsProspect] = useMutation(
        gql(`
            mutation createProspectChat($subcourseId: Float!, $instructorUserId: String!) {
                prospectChatCreate(subcourseId: $subcourseId, instructorUserId: $instructorUserId)
            }       
        `)
    );

    async function contactInstructorAsParticipant() {
        const conversation = await chatCreateForSubcourse({
            variables: { subcourseId: subcourseId, memberUserId: `student/${data?.subcourse?.instructors[0].id}` },
        });
        if (conversation) {
            navigate('/chat', { state: { conversationId: conversation?.data?.participantChatCreate } });
        } else {
            toast.show({ description: t('chat.chatError'), placement: 'top' });
        }
    }

    async function contactInstructorAsProspect() {
        const conversation = await chatCreateAsProspect({
            variables: { subcourseId: subcourseId, instructorUserId: `student/${data?.subcourse?.instructors[0].id}` },
        });
        if (conversation) {
            navigate('/chat', { state: { conversationId: conversation?.data?.prospectChatCreate } });
        } else {
            toast.show({ description: t('chat.chatError'), placement: 'top' });
        }
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
            title: t('single.tabs.lessons'),
            content: (
                <Box minH={300}>
                    <AppointmentList
                        isReadOnlyList={!subcourse?.isParticipant}
                        disableScroll
                        appointments={data?.subcourse?.appointments as Appointment[]}
                        noOldAppointments
                    />
                </Box>
            ),
        },
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
                        appointment={myNextAppointment as Lecture}
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
                        joinSubcourse={() => joinSubcourse()}
                        leaveSubcourse={() => leaveSubcourse()}
                        joinWaitinglist={() => joinWaitingList()}
                        leaveWaitinglist={() => leaveWaitingList()}
                        contactInstructorAsParticipant={contactInstructorAsParticipant}
                        contactInstructorAsProspect={contactInstructorAsProspect}
                        refresh={refetch}
                    />
                )}
                <Tabs tabs={tabs} />
            </Stack>
        </WithNavigation>
    );
};

export default SingleCoursePupil;
