import { ApolloQueryResult } from '@apollo/client';
import { Button, Modal, Stack, useTheme, useToast, VStack } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Subcourse } from '../../../gql/graphql';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import CourseConfirmationModal from '../../../modals/CourseConfirmationModal';
import SendParticipantsMessageModal from '../../../modals/SendParticipantsMessageModal';
import AlertMessage from '../../../widgets/AlertMessage';
import JoinMeeting from '../../subcourse/JoinMeeting';

type CanJoin = {
    allowed: boolean;
    reason: string;
};

type ActionButtonProps = {
    courseFull: boolean;
    canJoinSubcourse: CanJoin;
    joinedSubcourse: boolean;
    joinedWaitinglist: boolean;
    leftSubcourseData: boolean;
    leftWaitinglist: boolean;
    loadingSubcourseJoined: boolean;
    loadingSubcourseLeft: boolean;
    loadingJoinedWaitinglist: boolean;
    loadingWaitinglistLeft: boolean;
    loadingContactInstructor: boolean;
    subcourse: Subcourse;
    joinSubcourse: () => Promise<any>;
    leaveSubcourse: () => void;
    joinWaitinglist: () => void;
    leaveWaitinglist: () => void;
    doContactInstructor: (title: string, body: string) => Promise<void>;
    refresh: () => Promise<ApolloQueryResult<void>>; //any
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
    doContactInstructor,
    refresh,
}) => {
    const [signInModal, setSignInModal] = useState<boolean>(false);
    const [signOutModal, setSignOutModal] = useState<boolean>(false);
    const [joinWaitinglistModal, setJoinWaitinglistModal] = useState<boolean>(false);
    const [leaveWaitinglistModal, setLeaveWaitingslistModal] = useState<boolean>(false);
    const [showMessageModal, setShowMessageModal] = useState<boolean>(false);

    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const toast = useToast();

    async function contactInstructor(title: string, body: string) {
        doContactInstructor(title, body);
        setShowMessageModal(false);
    }

    const handleSignInCourse = useCallback(() => {
        setSignInModal(false);
        joinSubcourse();
        toast.show({ description: t('single.signIn.toast'), placement: 'top' });
    }, []);

    const handleCourseLeave = useCallback(async () => {
        setSignOutModal(false);
        leaveSubcourse();
        toast.show({ description: t('single.leave.toast'), placement: 'top' });
    }, []);

    const handleJoinWaitinglist = useCallback(() => {
        joinWaitinglist();
        setJoinWaitinglistModal(false);
        toast.show({ description: t('single.signIn.toast'), placement: 'top' });
    }, []);

    const handleWaitinglistLeave = useCallback(async () => {
        setLeaveWaitingslistModal(false);
        leaveWaitinglist();
        toast.show({ description: t('single.leaveWaitinglist.toast'), placement: 'top' });
    }, []);

    useEffect(() => {
        if (joinedSubcourse || leftSubcourseData || joinedWaitinglist || leftWaitinglist) {
            refresh();
        }
    }, [joinedSubcourse, leftSubcourseData, joinedWaitinglist, leftWaitinglist]);

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {!subcourse?.isParticipant &&
                    (canJoinSubcourse?.allowed ? (
                        <Button onPress={() => setSignInModal(true)} isDisabled={loadingSubcourseJoined}>
                            {t('signin')}
                        </Button>
                    ) : (
                        <AlertMessage content={t(`lernfair.reason.course.pupil.${canJoinSubcourse?.reason}` as unknown as TemplateStringsArray)} />
                    ))}

                {subcourse?.isParticipant && (
                    <Button onPress={() => setSignOutModal(true)} isDisabled={loadingSubcourseLeft}>
                        {t('single.actions.leaveSubcourse')}
                    </Button>
                )}
                {!subcourse?.isParticipant && courseFull && !subcourse.isOnWaitingList && (
                    <Button variant="outline" onPress={() => setJoinWaitinglistModal(true)} isDisabled={loadingJoinedWaitinglist}>
                        {t('single.actions.joinWaitinglist')}
                    </Button>
                )}
                {subcourse.isOnWaitingList && (
                    <Button variant="outline" onPress={() => setLeaveWaitingslistModal(true)} isDisabled={loadingWaitinglistLeft}>
                        {t('single.actions.leaveWaitinglist')}
                    </Button>
                )}
                {subcourse.isParticipant && (
                    <Button variant="outline" onPress={() => setShowMessageModal(true)}>
                        {t('single.actions.contactInstructor')}
                    </Button>
                )}
                {subcourse?.isParticipant && subcourse?.published && <JoinMeeting subcourse={subcourse} refresh={refresh} />}
            </Stack>
            <VStack mt="3">
                {subcourse?.isParticipant && <AlertMessage content={t('single.card.alreadyRegistered')} />}
                {subcourse?.isOnWaitingList && <AlertMessage content={t('single.card.waitingListMember')} />}
            </VStack>
            <Modal isOpen={signInModal} onClose={() => setSignInModal(false)}>
                <CourseConfirmationModal
                    headline={t('single.global.courseInfo')}
                    confirmButtonText={t('single.signIn.button')}
                    description={t('single.signIn.description')}
                    onClose={() => setSignInModal(false)}
                    onConfirm={handleSignInCourse}
                />
            </Modal>

            <Modal isOpen={signOutModal} onClose={() => setSignOutModal(false)}>
                <CourseConfirmationModal
                    headline={t('single.global.courseInfo')}
                    confirmButtonText={t('single.leave.signOut')}
                    description={t('single.leave.description')}
                    onClose={() => setSignOutModal(false)}
                    onConfirm={() => handleCourseLeave()}
                />
            </Modal>

            <Modal isOpen={joinWaitinglistModal} onClose={() => setJoinWaitinglistModal(false)}>
                <CourseConfirmationModal
                    headline={t('single.global.courseInfo')}
                    confirmButtonText={t('single.joinWaitinglist.button')}
                    description={t('single.joinWaitinglist.description')}
                    onClose={() => setJoinWaitinglistModal(false)}
                    onConfirm={handleJoinWaitinglist}
                />
            </Modal>

            <Modal isOpen={leaveWaitinglistModal} onClose={() => setLeaveWaitingslistModal(false)}>
                <CourseConfirmationModal
                    headline={t('single.global.courseInfo')}
                    confirmButtonText={t('single.joinWaitinglist.button')}
                    description={t('single.joinWaitinglist.description')}
                    onClose={() => setJoinWaitinglistModal(false)}
                    onConfirm={handleWaitinglistLeave}
                />
            </Modal>

            <SendParticipantsMessageModal
                isInstructor={false}
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                onSend={contactInstructor}
                isDisabled={loadingContactInstructor}
            />
        </>
    );
};

export default PupilCourseButtons;
