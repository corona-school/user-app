import { ApolloQueryResult, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Instructor, Lecture, Subcourse } from '../../../gql/graphql';
import ConfirmationModal from '../../../modals/ConfirmationModal';
import { getTrafficStatus } from '../../../Utility';
import WaitinglistBanner from '../../../widgets/WaitinglistBanner';
import OpenCourseChatButton from '../../subcourse/OpenCourseChatButton';
import { gql } from '../../../gql';
import VideoButton from '../../../components/VideoButton';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { IconMessage2, IconInfoCircleFilled } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Alert } from '@/components/Alert';
import { RecommendationEnum, RecommendationsContext } from '@/context/RecommendationsContext';

type CanJoinReason = 'not-participant' | 'no-lectures' | 'already-started' | 'already-participant' | 'grade-to-low' | 'grade-to-high' | 'subcourse-full';

type PupilCourseButtonsProps = {
    subcourse: Pick<
        Subcourse,
        | 'id'
        | 'participantsCount'
        | 'maxParticipants'
        | 'isParticipant'
        | 'isOnWaitingList'
        | 'canContactInstructor'
        | 'allowChatContactProspects'
        | 'allowChatContactParticipants'
        | 'groupChatType'
        | 'canJoin'
        | 'canJoinWaitinglist'
        | 'isParticipant'
        | 'isOnWaitingList'
    > & { instructors: Pick<Instructor, 'id'>[]; appointments: Pick<Lecture, 'id' | 'duration' | 'start' | 'appointmentType' | 'override_meeting_link'>[] };
    refresh: () => Promise<ApolloQueryResult<unknown>>;
    isActiveSubcourse: boolean;
    appointment?: Lecture;
};

const courseConversationId = gql(`
query GetCourseConversationId($subcourseId: Int!, $isParticipant: Boolean!) {
    subcourse (subcourseId: $subcourseId) {
        conversationId @include(if: $isParticipant)
    }
}
`);

const TOTAL_SUBCOURSES_JOINED_QUERY = gql(`
query totalSubcoursesJoined {
    me {
        pupil {
            totalSubcoursesJoined
        }
    }
}
`);

const PupilCourseButtons = ({ subcourse, refresh, isActiveSubcourse, appointment }: PupilCourseButtonsProps) => {
    const [signInModal, setSignInModal] = useState(false);
    const [signOutModal, setSignOutModal] = useState(false);
    const [joinWaitinglistModal, setJoinWaitinglistModal] = useState(false);
    const [leaveWaitinglistModal, setLeaveWaitingslistModal] = useState(false);
    const { recommend } = useContext(RecommendationsContext);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [joinSubcourse, { loading: loadingSubcourseJoined, data: joinedSubcourse }] = useMutation(
        gql(`
            mutation SubcourseJoin($subcourseId: Float!) {
                subcourseJoin(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourse.id },
        }
    );

    const [leaveSubcourse, { loading: loadingSubcourseLeft, data: leftSubcourse }] = useMutation(
        gql(`
            mutation LeaveSubcourse($subcourseId: Float!) {
                subcourseLeave(subcourseId: $subcourseId)
            }
        `),
        { variables: { subcourseId: subcourse.id } }
    );

    const [joinWaitinglist, { data: joinedWaitinglist, loading: loadingJoinedWaitinglist }] = useMutation(
        gql(`
            mutation JoinWaitingList($subcourseId: Float!) {
                subcourseJoinWaitinglist(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourse.id },
        }
    );

    const [leaveWaitinglist, { data: leftWaitinglist, loading: loadingLeftWaitinglist }] = useMutation(
        gql(`
            mutation LeaveWaitingList($subcourseId: Float!) {
                subcourseLeaveWaitinglist(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourse.id },
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

    const { data: totalSubcoursesQuery } = useQuery(TOTAL_SUBCOURSES_JOINED_QUERY);

    async function contactInstructorAsParticipant() {
        try {
            const conversation = await chatCreateForSubcourse({
                variables: { subcourseId: subcourse.id, memberUserId: `student/${subcourse.instructors[0].id}` },
            });
            navigate('/chat', { state: { conversationId: conversation?.data?.participantChatCreate } });
        } catch (error) {
            toast.error(t('chat.chatError'));
        }
    }

    async function contactInstructorAsProspect() {
        try {
            const conversation = await chatCreateAsProspect({
                variables: { subcourseId: subcourse.id, instructorUserId: `student/${subcourse.instructors[0].id}` },
            });
            navigate('/chat', { state: { conversationId: conversation?.data?.prospectChatCreate } });
        } catch (error) {
            toast.error(t('chat.chatError'));
        }
    }

    const { data, loading } = useQuery(courseConversationId, {
        variables: { subcourseId: subcourse.id, isParticipant: subcourse?.isParticipant! },
    });

    const conversationId = data?.subcourse?.conversationId || '';

    const handleSignInCourse = async () => {
        setSignInModal(false);
        try {
            await joinSubcourse();
            if (totalSubcoursesQuery?.me.pupil?.totalSubcoursesJoined === 0) {
                recommend(RecommendationEnum.PUSH_NOTIFICATIONS_JOINED_COURSE);
            }
            toast.success(t('single.signIn.toast'));
        } catch (e) {
            toast.error(t('single.signIn.error'));
        }
    };

    const handleCourseLeave = useCallback(async () => {
        setSignOutModal(false);
        await leaveSubcourse();
        toast.success(t('single.leave.toast'));
    }, []);

    const handleJoinWaitinglist = useCallback(async () => {
        setJoinWaitinglistModal(false);
        await joinWaitinglist();
        toast.success(t('single.joinWaitinglist.toast'));
    }, []);

    const handleWaitinglistLeave = useCallback(async () => {
        setLeaveWaitingslistModal(false);
        await leaveWaitinglist();
        toast.success(t('single.leaveWaitinglist.toast'));
    }, []);

    const courseTrafficStatus = useMemo(
        () => getTrafficStatus(subcourse?.participantsCount || 0, subcourse?.maxParticipants || 0),
        [subcourse?.maxParticipants, subcourse?.participantsCount]
    );

    useEffect(() => {
        if (joinedSubcourse || leftSubcourse || joinedWaitinglist || leftWaitinglist) {
            refresh();
        }
    }, [joinedSubcourse, leftSubcourse, joinedWaitinglist, leftWaitinglist]);

    return (
        <>
            {!subcourse.isParticipant && subcourse.canJoin?.allowed === false && (
                <Alert className="w-full md:w-fit" icon={<IconInfoCircleFilled />}>
                    {t(`lernfair.reason.course.pupil.${subcourse.canJoin.reason as CanJoinReason}`)}
                </Alert>
            )}
            <div className="flex flex-col items-stretch lg:items-center gap-y-4 md:flex-row md:gap-x-4 md:flex-wrap lg:w-1/2">
                {!subcourse.isParticipant && subcourse.canJoin?.allowed && (
                    <Button
                        disabled={loadingSubcourseJoined}
                        reasonDisabled={t('reasonsDisabled.loading')}
                        onClick={() => setSignInModal(true)}
                        className="w-full  md:w-fit"
                    >
                        {t('signin')}
                    </Button>
                )}
                {subcourse.isParticipant && !loading && isActiveSubcourse && conversationId && (
                    <OpenCourseChatButton
                        groupChatType={subcourse.groupChatType}
                        conversationId={conversationId}
                        subcourseId={subcourse.id}
                        participantsCount={subcourse.participantsCount}
                        isParticipant={subcourse.isParticipant}
                        refresh={refresh}
                        className="w-full  md:w-fit"
                    />
                )}
                {subcourse.isParticipant && isActiveSubcourse && (
                    <>
                        {appointment && (
                            <VideoButton
                                appointmentId={appointment.id}
                                appointmentType={appointment.appointmentType}
                                startDateTime={appointment.start}
                                duration={appointment.duration}
                                className="w-full  md:w-fit"
                                overrideLink={appointment.override_meeting_link ?? undefined}
                            />
                        )}
                        <Button
                            variant="ghost"
                            disabled={loadingSubcourseLeft}
                            reasonDisabled={t('reasonsDisabled.loading')}
                            onClick={() => setSignOutModal(true)}
                            className="w-full  md:w-fit"
                        >
                            {t('single.actions.leaveSubcourse')}
                        </Button>
                    </>
                )}
                {subcourse.isParticipant && subcourse.canContactInstructor.allowed && isActiveSubcourse && (
                    <Button
                        variant="outline"
                        onClick={() => contactInstructorAsParticipant()}
                        leftIcon={<IconMessage2 size={16} />}
                        className="w-full  md:w-fit"
                    >
                        {t('single.actions.contactInstructor')}
                    </Button>
                )}
                {!subcourse.isParticipant && subcourse.allowChatContactProspects && isActiveSubcourse && (
                    <Button variant="outline" onClick={() => contactInstructorAsProspect()} leftIcon={<IconMessage2 size={16} />} className="w-full  md:w-fit">
                        {t('single.actions.contactInstructor')}
                    </Button>
                )}
                {!subcourse.isParticipant && !subcourse.isOnWaitingList && !subcourse.canJoin.allowed && subcourse.canJoinWaitinglist.allowed && (
                    <Button
                        disabled={loadingJoinedWaitinglist}
                        reasonDisabled={t('reasonsDisabled.loading')}
                        variant="outline"
                        onClick={() => setJoinWaitinglistModal(true)}
                        className="w-full  md:w-fit"
                    >
                        {t('single.actions.joinWaitinglist')}
                    </Button>
                )}
            </div>
            {subcourse.isOnWaitingList && (
                <div className="flex gap-0.5 mb-5">
                    <WaitinglistBanner
                        courseStatus={courseTrafficStatus}
                        onLeaveWaitingList={() => setLeaveWaitingslistModal(true)}
                        loading={loadingLeftWaitinglist}
                    />
                </div>
            )}

            <ConfirmationModal
                headline={t('registrationTitle')}
                confirmButtonText={t('single.signIn.button')}
                description={<Trans i18nKey="single.signIn.description" components={{ b: <b />, br: <br /> }} />}
                onOpenChange={setSignInModal}
                isOpen={signInModal}
                onConfirm={handleSignInCourse}
                isLoading={loadingSubcourseJoined}
            />

            <ConfirmationModal
                headline={t('deregistrationTitle')}
                confirmButtonText={t('single.leave.signOut')}
                description={t('single.leave.description')}
                onOpenChange={setSignOutModal}
                isOpen={signOutModal}
                onConfirm={() => handleCourseLeave()}
                variant="destructive"
                isLoading={loadingSubcourseLeft}
            />

            <ConfirmationModal
                headline={t('registrationTitle')}
                confirmButtonText={t('single.joinWaitinglist.button')}
                description={t('single.joinWaitinglist.description')}
                onOpenChange={setJoinWaitinglistModal}
                isOpen={joinWaitinglistModal}
                onConfirm={handleJoinWaitinglist}
                isLoading={loadingJoinedWaitinglist}
            />
            <ConfirmationModal
                headline={t('deregistrationTitle')}
                confirmButtonText={t('single.leaveWaitinglist.button')}
                description={t('single.leaveWaitinglist.description')}
                onOpenChange={setLeaveWaitingslistModal}
                isOpen={leaveWaitinglistModal}
                onConfirm={handleWaitinglistLeave}
                variant="destructive"
                isLoading={loadingLeftWaitinglist}
            />
        </>
    );
};

export default PupilCourseButtons;
