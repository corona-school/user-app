import { ApolloQueryResult, useMutation, useQuery } from '@apollo/client';
import { Button, Modal, Stack, useTheme, useToast, VStack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Instructor, Lecture, Subcourse } from '../../../gql/graphql';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import CourseConfirmationModal from '../../../modals/CourseConfirmationModal';
import { getTrafficStatus } from '../../../Utility';
import WaitinglistBanner from '../../../widgets/WaitinglistBanner';
import AlertMessage from '../../../widgets/AlertMessage';
import OpenCourseChatButton from '../../subcourse/OpenCourseChatButton';
import { canJoinMeeting } from '../../../widgets/AppointmentDay';
import { DateTime } from 'luxon';
import { gql } from '../../../gql';
import VideoButton from '../../../components/VideoButton';
import { useNavigate } from 'react-router-dom';
import DisablebleButton from '../../../components/DisablebleButton';

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
    const [signInModal, setSignInModal] = useState<boolean>(false);
    const [signOutModal, setSignOutModal] = useState<boolean>(false);
    const [joinWaitinglistModal, setJoinWaitinglistModal] = useState<boolean>(false);
    const [leaveWaitinglistModal, setLeaveWaitingslistModal] = useState<boolean>(false);

    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
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
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {!subcourse.isParticipant && subcourse.canJoin?.allowed && (
                    <DisablebleButton
                        isDisabled={loadingSubcourseJoined}
                        reasonDisabled={t('reasonsDisabled.loading')}
                        buttonProps={{
                            onPress: () => setSignInModal(true),
                        }}
                    >
                        {t('signin')}
                    </DisablebleButton>
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
                    />
                )}
                {subcourse.isParticipant && subcourse.canContactInstructor.allowed && isActiveSubcourse && (
                    <Button variant="outline" onPress={() => contactInstructorAsParticipant()}>
                        {t('single.actions.contactInstructor')}
                    </Button>
                )}
                {!subcourse.isParticipant && subcourse.allowChatContactProspects && isActiveSubcourse && (
                    <Button variant="outline" onPress={() => contactInstructorAsProspect()}>
                        {t('single.actions.contactInstructor')}
                    </Button>
                )}
                {subcourse.isParticipant && isActiveSubcourse && (
                    <>
                        <VideoButton
                            appointmentId={appointment.id}
                            appointmentType={appointment.appointmentType}
                            canJoinMeeting={canJoinMeeting(appointment.start, appointment.duration, 10, DateTime.now())}
                        />
                        <DisablebleButton
                            isDisabled={loadingSubcourseLeft}
                            reasonDisabled={t('reasonsDisabled.loading')}
                            buttonProps={{
                                onPress: () => setSignOutModal(true),
                            }}
                        >
                            {t('single.actions.leaveSubcourse')}
                        </DisablebleButton>
                    </>
                )}
                {!subcourse.isParticipant && !subcourse.isOnWaitingList && !subcourse.canJoin.allowed && subcourse.canJoinWaitinglist.allowed && (
                    <DisablebleButton
                        isDisabled={loadingJoinedWaitinglist}
                        reasonDisabled={t('reasonsDisabled.loading')}
                        buttonProps={{
                            variant: 'outline',
                            onPress: () => setJoinWaitinglistModal(true),
                        }}
                    >
                        {t('single.actions.joinWaitinglist')}
                    </DisablebleButton>
                )}
                {subcourse.isOnWaitingList && (
                    <VStack space={space['0.5']} mb="5">
                        <WaitinglistBanner courseStatus={courseTrafficStatus} onLeaveWaitinglist={setLeaveWaitingslistModal} loading={loadingLeftWaitinglist} />
                    </VStack>
                )}
            </Stack>

            <Modal isOpen={signInModal} onClose={() => setSignInModal(false)}>
                <CourseConfirmationModal
                    headline={t('registrationTitle')}
                    confirmButtonText={t('single.signIn.button')}
                    description={<Trans i18nKey="single.signIn.description" components={{ b: <b />, br: <br /> }} />}
                    onClose={() => setSignInModal(false)}
                    onConfirm={handleSignInCourse}
                />
            </Modal>

            <Modal isOpen={signOutModal} onClose={() => setSignOutModal(false)}>
                <CourseConfirmationModal
                    headline={t('deregistrationTitle')}
                    confirmButtonText={t('single.leave.signOut')}
                    description={t('single.leave.description')}
                    onClose={() => setSignOutModal(false)}
                    onConfirm={() => handleCourseLeave()}
                />
            </Modal>

            <Modal isOpen={joinWaitinglistModal} onClose={() => setJoinWaitinglistModal(false)}>
                <CourseConfirmationModal
                    headline={t('registrationTitle')}
                    confirmButtonText={t('single.joinWaitinglist.button')}
                    description={t('single.joinWaitinglist.description')}
                    onClose={() => setJoinWaitinglistModal(false)}
                    onConfirm={handleJoinWaitinglist}
                />
            </Modal>

            <Modal isOpen={leaveWaitinglistModal} onClose={() => setLeaveWaitingslistModal(false)}>
                <CourseConfirmationModal
                    headline={t('deregistrationTitle')}
                    confirmButtonText={t('single.leaveWaitinglist.button')}
                    description={t('single.leaveWaitinglist.description')}
                    onClose={() => setJoinWaitinglistModal(false)}
                    onConfirm={handleWaitinglistLeave}
                />
            </Modal>
        </>
    );
};

export default PupilCourseButtons;
