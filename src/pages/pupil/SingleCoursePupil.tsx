import { gql, useMutation, useQuery } from '@apollo/client';
import { Column, Heading, Row, Stack, Text, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs, { Tab } from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import { Participant } from '../../gql/graphql';
import { getSchoolTypeKey } from '../../types/lernfair/SchoolType';
import SubcourseActionButtons from './single-course/SubcourseActionButtons';
import SubcourseData from './single-course/SubcourseData';

function ParticipantRow({ participant }: { participant: { firstname: string; lastname?: string; schooltype?: string; grade?: string } }) {
    const { space } = useTheme();
    return (
        <Row marginBottom={space['1.5']} alignItems="center">
            <Column marginRight={space['1']}></Column>
            <Column>
                <Heading fontSize="md">
                    {participant.firstname} {participant.lastname}
                </Heading>
                <Text>
                    {participant.schooltype && `${getSchoolTypeKey(participant.schooltype)}, `}
                    {participant.grade}
                </Text>
            </Column>
        </Row>
    );
}

function OtherParticipants({ subcourseId }: { subcourseId: number }) {
    const { t } = useTranslation();
    const { data } = useQuery(
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

    if (!data) return <CenterLoadingSpinner />;

    const otherParticipants = data!.subcourse!.otherParticipants;

    if (otherParticipants.length === 0) return <Text>{t('single.global.noMembers')}</Text>;

    return (
        <>
            <ParticipantRow participant={data.me.pupil as any} />
            {otherParticipants.map((participant: Participant) => (
                <ParticipantRow participant={participant} />
            ))}
        </>
    );
}

const singleSubcoursePupilQuery = gql(`
query GetSingleSubcourse($subcourseId: Int!, $isStudent: Boolean = false) {
    subcourse(subcourseId: $subcourseId){
        id
        participantsCount
        maxParticipants
        minGrade
        maxGrade
        capacity
        published
        publishedAt
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

        published
        isInstructor
        isParticipant
        isOnWaitingList
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

    const [leaveSubcourse, { loading: loadingSubcourseLeft }] = useMutation(
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
        mutation NotifyInstructors($subcourseId: Int!, $title: String!, $body: String!) {
            subcourseNotifyInstructor(subcourseId: $subcourseId fileIDs: [] title: $title body: $body)
        }
    `)
    );

    async function doContact(title: string, body: string) {
        await contact({ variables: { subcourseId: subcourseId, title, body } });
        toast.show({ description: 'Benachrichtigung verschickt', placement: 'top' });
    }

    const courseFull = (subcourse?.participantsCount ?? 0) >= (subcourse?.maxParticipants ?? 0);

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
                    <Text>Termine</Text>
                </>
            ),
        },
    ];

    if (subcourse?.isInstructor || subcourse?.isParticipant) {
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
            <Stack space={space['1.5']} paddingX={space['1.5']}>
                <Stack>
                    <SubcourseData course={course} subcourse={subcourse} />
                </Stack>
                <Stack>
                    <SubcourseActionButtons
                        isParticipant={subcourse?.isParticipant}
                        isOnWaitingList={subcourse?.isOnWaitingList}
                        isPublished={subcourse?.published}
                        courseFull={courseFull}
                        subcourse={subcourse}
                        canJoinSubcourse={canJoinData?.subcourse?.canJoin}
                        joinedSubcourse={joinedSubcourseData}
                        joinedWaitinglist={joinedWaitinglist}
                        leftWaitinglist={leftWaitinglist}
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
                </Stack>
                <Tabs tabs={tabs} />
            </Stack>
        </WithNavigation>
    );
};

export default SingleCoursePupil;
