import { ApolloQueryResult } from '@apollo/client';
import { Button, Modal, Stack, useTheme, useToast, VStack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Chat_Type } from '../../../gql/graphql';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import CourseConfirmationModal from '../../../modals/CourseConfirmationModal';
import { getTrafficStatus } from '../../../Utility';
import WaitinglistBanner from '../../../widgets/WaitinglistBanner';
import JoinMeeting from '../../subcourse/JoinMeeting';
import AlertMessage from '../../../widgets/AlertMessage';
import OpenSubcourseChat from '../../subcourse/OpenSubcourseChat';

type CanJoin = {
    allowed: boolean;
    reason?: 'not-participant' | 'no-lectures' | 'already-started' | 'already-participant' | 'grade-to-low' | 'grade-to-high' | 'subcourse-full' | null;
};

type SubcourseOfPupil = Subcourse & {
    groupChatType: Chat_Type;
};

type ActionButtonProps = {
    courseFull: boolean;
    canJoinSubcourse?: CanJoin;
    joinedSubcourse?: boolean;
    joinedWaitinglist?: boolean;
    leftSubcourseData?: boolean;
    leftWaitinglist?: boolean;
    loadingSubcourseJoined: boolean;
    loadingSubcourseLeft: boolean;
    loadingJoinedWaitinglist: boolean;
    loadingWaitinglistLeft: boolean;
    loadingContactInstructor: boolean;
    subcourse: SubcourseOfPupil;
    joinSubcourse: () => Promise<any>;
    leaveSubcourse: () => void;
    joinWaitinglist: () => void;
    leaveWaitinglist: () => void;
    contactInstructor: () => Promise<void>;
    refresh: () => Promise<ApolloQueryResult<unknown>>;
};

const PupilCourseButtons: React.FC<ActionButtonProps> = ({
    courseFull,
    canJoinSubcourse,
    joinedSubcourse,
    joinedWaitinglist,
    leftSubcourseData,
    leftWaitinglist,
    loadingSubcourseJoined,
    loadingSubcourseLeft,
    subcourse,
    loadingJoinedWaitinglist,
    loadingWaitinglistLeft,
    loadingContactInstructor,
    joinSubcourse,
    leaveSubcourse,
    joinWaitinglist,
    leaveWaitinglist,
    contactInstructor,
    refresh,
}) => {
    const [signInModal, setSignInModal] = useState<boolean>(false);
    const [signOutModal, setSignOutModal] = useState<boolean>(false);
    const [joinWaitinglistModal, setJoinWaitinglistModal] = useState<boolean>(false);
    const [leaveWaitinglistModal, setLeaveWaitingslistModal] = useState<boolean>(false);

    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const toast = useToast();

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
        if (joinedSubcourse || leftSubcourseData || joinedWaitinglist || leftWaitinglist) {
            refresh();
        }
    }, [joinedSubcourse, leftSubcourseData, joinedWaitinglist, leftWaitinglist]);

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {!subcourse.isParticipant && canJoinSubcourse?.allowed && (
                    <Button onPress={() => setSignInModal(true)} isDisabled={loadingSubcourseJoined}>
                        {t('signin')}
                    </Button>
                )}
                {!subcourse.isParticipant && canJoinSubcourse?.allowed === false && (
                    <AlertMessage content={t(`lernfair.reason.course.pupil.${canJoinSubcourse.reason!}`)} />
                )}

                {subcourse.isParticipant && (
                    <OpenSubcourseChat
                        groupChatType={subcourse.groupChatType}
                        conversationId={subcourse.conversationId}
                        subcourseId={subcourse.id}
                        participantsCount={subcourse.participantsCount}
                        isParticipant={subcourse.isParticipant}
                        refresh={refresh}
                    />
                )}
                {!subcourse.isParticipant && courseFull && !subcourse.isOnWaitingList && (
                    <Button variant="outline" onPress={() => setJoinWaitinglistModal(true)} isDisabled={loadingJoinedWaitinglist}>
                        {t('single.actions.joinWaitinglist')}
                    </Button>
                )}
                {subcourse.isOnWaitingList && (
                    <VStack space={space['0.5']} mb="5">
                        <WaitinglistBanner courseStatus={courseTrafficStatus} onLeaveWaitinglist={setLeaveWaitingslistModal} loading={loadingWaitinglistLeft} />
                    </VStack>
                )}
                {subcourse.isParticipant && subcourse.allowChatContactParticipants && (
                    <Button variant="outline" onPress={() => contactInstructor()}>
                        {t('single.actions.contactInstructor')}
                    </Button>
                )}
                {subcourse.isParticipant && <JoinMeeting subcourse={subcourse} refresh={refresh} />}
                {subcourse.isParticipant && (
                    <Button variant="outline" onPress={() => setSignOutModal(true)} isDisabled={loadingSubcourseLeft}>
                        {t('single.actions.leaveSubcourse')}
                    </Button>
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
