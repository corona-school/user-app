import { ApolloQueryResult, useMutation, useQuery } from '@apollo/client';
import { useToast } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Instructor, Lecture, Subcourse } from '../../../gql/graphql';
import CourseConfirmationModal from '../../../modals/CourseConfirmationModal';
import { getTrafficStatus } from '../../../Utility';
import WaitinglistBanner from '../../../widgets/WaitinglistBanner';
import AlertMessage from '../../../widgets/AlertMessage';
import OpenCourseChatButton from '../../subcourse/OpenCourseChatButton';
import { gql } from '../../../gql';
import VideoButton from '../../../components/VideoButton';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { IconMessage2 } from '@tabler/icons-react';

type CanJoinReason = 'not-participant' | 'no-lectures' | 'already-started' | 'already-participant' | 'grade-to-low' | 'grade-to-high' | 'subcourse-full';

type ActionButtonProps = {
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
    > & { instructors: Pick<Instructor, 'id'>[]; appointments: Pick<Lecture, 'id' | 'duration' | 'start' | 'appointmentType'>[] };
    refresh: () => Promise<ApolloQueryResult<unknown>>;
    isActiveSubcourse: boolean;
};

const courseConversationId = gql(`
query GetCourseConversationId($subcourseId: Int!, $isParticipant: Boolean!) {
    subcourse (subcourseId: $subcourseId) {
        conversationId @include(if: $isParticipant)
    }
}
`);

const PupilCourseButtons: React.FC<ActionButtonProps> = ({ subcourse, refresh, isActiveSubcourse }) => {
    const [signInModal, setSignInModal] = useState(false);
    const [signOutModal, setSignOutModal] = useState(false);
    const [joinWaitinglistModal, setJoinWaitinglistModal] = useState(false);
    const [leaveWaitinglistModal, setLeaveWaitingslistModal] = useState(false);

    const { t } = useTranslation();
    const toast = useToast();
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

    async function contactInstructorAsParticipant() {
        const conversation = await chatCreateForSubcourse({
            variables: { subcourseId: subcourse.id, memberUserId: `student/${subcourse.instructors[0].id}` },
        });
        if (conversation) {
            navigate('/chat', { state: { conversationId: conversation?.data?.participantChatCreate } });
        } else {
            toast.show({ description: t('chat.chatError'), placement: 'top' });
        }
    }

    async function contactInstructorAsProspect() {
        const conversation = await chatCreateAsProspect({
            variables: { subcourseId: subcourse.id, instructorUserId: `student/${subcourse.instructors[0].id}` },
        });
        if (conversation) {
            navigate('/chat', { state: { conversationId: conversation?.data?.prospectChatCreate } });
        } else {
            toast.show({ description: t('chat.chatError'), placement: 'top' });
        }
    }

    const { data, loading } = useQuery(courseConversationId, {
        variables: { subcourseId: subcourse.id, isParticipant: subcourse?.isParticipant! },
    });

    const conversationId = data?.subcourse?.conversationId || '';

    const handleSignInCourse = useCallback(async () => {
        setSignInModal(false);
        try {
            await joinSubcourse();
            toast.show({ description: t('single.signIn.toast'), placement: 'top' });
        } catch (e) {
            toast.show({ description: t('single.signIn.error'), placement: 'top' });
        }
    }, []);

    const handleCourseLeave = useCallback(async () => {
        setSignOutModal(false);
        leaveSubcourse();
        toast.show({ description: t('single.leave.toast'), placement: 'top' });
    }, []);

    const handleJoinWaitinglist = useCallback(() => {
        joinWaitinglist();
        setJoinWaitinglistModal(false);
        toast.show({ description: t('single.joinWaitinglist.toast'), placement: 'top' });
    }, []);

    const handleWaitinglistLeave = useCallback(async () => {
        leaveWaitinglist();
        setLeaveWaitingslistModal(false);
        toast.show({ description: t('single.leaveWaitinglist.toast'), placement: 'top' });
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

    const appointment = subcourse.appointments[0];
    return (
        <>
            <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 md:flex-wrap lg:w-1/2">
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
                {!subcourse.isParticipant && subcourse.canJoin?.allowed === false && (
                    <AlertMessage content={t(`lernfair.reason.course.pupil.${subcourse.canJoin.reason as CanJoinReason}`)} />
                )}

                {subcourse.isParticipant && !loading && isActiveSubcourse && (
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
                        <VideoButton
                            appointmentId={appointment.id}
                            appointmentType={appointment.appointmentType}
                            startDateTime={appointment.start}
                            duration={appointment.duration}
                            className="w-full  md:w-fit"
                        />
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
                    <WaitinglistBanner courseStatus={courseTrafficStatus} onLeaveWaitinglist={setLeaveWaitingslistModal} loading={loadingLeftWaitinglist} />
                </div>
            )}

            <CourseConfirmationModal
                headline={t('registrationTitle')}
                confirmButtonText={t('single.signIn.button')}
                description={<Trans i18nKey="single.signIn.description" components={{ b: <b />, br: <br /> }} />}
                onOpenChange={setSignInModal}
                isOpen={signInModal}
                onConfirm={handleSignInCourse}
            />

            <CourseConfirmationModal
                headline={t('deregistrationTitle')}
                confirmButtonText={t('single.leave.signOut')}
                description={t('single.leave.description')}
                onOpenChange={setSignOutModal}
                isOpen={signOutModal}
                onConfirm={() => handleCourseLeave()}
                variant="destructive"
            />

            <CourseConfirmationModal
                headline={t('registrationTitle')}
                confirmButtonText={t('single.joinWaitinglist.button')}
                description={t('single.joinWaitinglist.description')}
                onOpenChange={setJoinWaitinglistModal}
                isOpen={joinWaitinglistModal}
                onConfirm={handleJoinWaitinglist}
            />
            <CourseConfirmationModal
                headline={t('deregistrationTitle')}
                confirmButtonText={t('single.leaveWaitinglist.button')}
                description={t('single.leaveWaitinglist.description')}
                onOpenChange={setLeaveWaitingslistModal}
                isOpen={leaveWaitinglistModal}
                onConfirm={handleWaitinglistLeave}
            />
        </>
    );
};

export default PupilCourseButtons;
