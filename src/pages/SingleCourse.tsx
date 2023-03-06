import { Box, Button, Column, Heading, Image, Modal, Row, Text, Tooltip, useBreakpointValue, useTheme, useToast, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Tabs, { Tab } from '../components/Tabs';
import Tag from '../components/Tag';
import WithNavigation from '../components/WithNavigation';

import Utility, { getTrafficStatus } from '../Utility';
import { gql } from '../gql';
import { useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AlertMessage from '../widgets/AlertMessage';
import { useUserType } from '../hooks/useApollo';

import { getSchoolTypeKey } from '../types/lernfair/SchoolType';
import SetMeetingLinkModal from '../modals/SetMeetingLinkModal';
import SendParticipantsMessageModal from '../modals/SendParticipantsMessageModal';
import CancelSubCourseModal from '../modals/CancelSubCourseModal';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { Course, Subcourse } from '../gql/graphql';
import { getTimeDifference } from '../helper/notification-helper';
import PromoteBanner from '../widgets/PromoteBanner';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { SelectParticipants } from '../widgets/SelectParticipants';

/* ------------- Common UI ---------------------------- */
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

function JoinMeetingAction({
    subcourse,
    refresh,
}: {
    subcourse: Pick<Subcourse, 'id'> & { lectures?: { start: string; duration: number }[] | null };
    refresh: () => void;
}) {
    const [disableMeetingButton, setDisableMeetingButton] = useState(true);
    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const [joinMeeting, _joinMeeting] = useMutation(
        gql(`mutation SubcourseJoinMeeting($subcourseId: Float!) {
        subcourseJoinMeeting(subcourseId: $subcourseId)
      }`),
        { variables: { subcourseId: subcourse.id } }
    );

    useEffect(() => {
        setInterval(() => {
            const currentOrNextLecture = subcourse.lectures?.find((lecture) => {
                const minutes = DateTime.fromISO(lecture.start).diffNow('minutes').minutes;
                return minutes < 60 && minutes > -lecture.duration;
            });
            setDisableMeetingButton(!currentOrNextLecture);
        }, 1000);
    }, [subcourse]);

    const [showMeetingNotStarted, setShowMeetingNotStarted] = useState<boolean>();

    const getMeetingLink = useCallback(async () => {
        // In some browsers the window MUST be opened as a direct reaction to an user action, otherwise it is just not opened
        // c.f. https://stackoverflow.com/questions/20696041/window-openurl-blank-not-working-on-imac-safari
        const windowRef = window.open(undefined, '_blank');

        try {
            const res = await joinMeeting({ variables: { subcourseId: subcourse.id } });

            if (res.data?.subcourseJoinMeeting) {
                if (windowRef) windowRef.location = res.data!.subcourseJoinMeeting;
            } else {
                setShowMeetingNotStarted(true);
                windowRef?.close();
            }
        } catch (e) {
            windowRef?.close();
            setShowMeetingNotStarted(true);
        }
    }, [subcourse, joinMeeting]);

    return (
        <>
            <VStack space={space['0.5']} py={space['1']} maxWidth={ContainerWidth}>
                <Tooltip isDisabled={disableMeetingButton} maxWidth={300} label={t('course.meeting.hint.pupil')}>
                    <Button width={ButtonContainer} onPress={getMeetingLink} isDisabled={_joinMeeting.loading || disableMeetingButton}>
                        Videochat beitreten
                    </Button>
                </Tooltip>
                {showMeetingNotStarted && <AlertMessage content="Der Videochat wurde noch nicht gestartet." />}
            </VStack>
        </>
    );
}

/* ------------- Student UI Elements ------------------ */
function Participants({ subcourseId }: { subcourseId: number }) {
    const { t } = useTranslation();
    const { data } = useQuery(
        gql(`
        query GetParticipants($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId){
                participants {
                    firstname
                    lastname
                    schooltype
                    grade
                }
            }
        }
    `),
        { variables: { subcourseId } }
    );

    if (!data) return <CenterLoadingSpinner />;

    const participants = data!.subcourse!.participants;

    if (participants.length === 0) return <Text>{t('single.global.noMembers')}</Text>;

    return (
        <>
            {participants.map((participant) => (
                <ParticipantRow participant={participant} />
            ))}
        </>
    );
}

function StudentCancelSubcourseAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'>; refresh: () => void }) {
    const toast = useToast();
    const { sizes } = useTheme();
    const { t } = useTranslation();

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const [showCancelModal, setShowCancelModal] = useState(false);

    const [cancelSubcourse] = useMutation(
        gql(`mutation CancelSubcourse($subcourseId: Float!) {
        subcourseCancel(subcourseId: $subcourseId)
      }`),
        { variables: { subcourseId: subcourse.id } }
    );

    const cancelCourse = useCallback(async () => {
        try {
            await cancelSubcourse();
            toast.show({ description: 'Der Kurs wurde erfolgreich abgesagt', placement: 'top' });
            refresh();
        } catch (e) {
            toast.show({ description: 'Der Kurs konnte nicht abgesagt werden', placement: 'top' });
        }
        setShowCancelModal(false);
    }, [cancelSubcourse, toast, refresh]);

    return (
        <>
            <Button onPress={() => setShowCancelModal(true)} width={ButtonContainer} variant="outline">
                {t('course.cancel.header')}
            </Button>
            <CancelSubCourseModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onCourseCancel={cancelCourse} />
        </>
    );
}

function StudentEditCourseAction({ subcourse, isInPast }: { subcourse: Pick<Subcourse, 'id'>; isInPast: boolean }) {
    const navigate = useNavigate();
    const { sizes } = useTheme();

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    return (
        <>
            <Button
                onPress={() => {
                    navigate('/edit-course', {
                        state: { courseId: subcourse.id },
                    });
                }}
                width={ButtonContainer}
                variant="outline"
                isDisabled={isInPast}
            >
                Kurs editieren
            </Button>
        </>
    );
}

function StudentSetMeetingUrlAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'>; refresh: () => void }) {
    const [showMeetingUrlModal, setShowMeetingUrlModal] = useState(false);

    const toast = useToast();
    const { t } = useTranslation();

    const [setMeetingUrl, { data, loading }] = useMutation(
        gql(`
    mutation setMeetingUrl($subcourseId: Float!, $meetingUrl: String!) {
        subcourseSetMeetingURL(subcourseId: $subcourseId, meetingURL: $meetingUrl)
    }
    `)
    );

    const _setMeetingLink = useCallback(
        async (link: string) => {
            try {
                const res = await setMeetingUrl({
                    variables: {
                        subcourseId: subcourse.id,
                        meetingUrl: link,
                    },
                });

                setShowMeetingUrlModal(false);
                if (res.data?.subcourseSetMeetingURL) {
                    toast.show({
                        description: t('course.meeting.result.success'),
                        placement: 'top',
                    });
                } else {
                    toast.show({
                        description: t('course.meeting.result.error'),
                        placement: 'top',
                    });
                }
            } catch (e) {
                toast.show({
                    description: t('course.meeting.result.error'),
                    placement: 'top',
                });
            }
        },
        [subcourse.id, setMeetingUrl, t, toast]
    );

    return (
        <>
            <SetMeetingLinkModal
                isOpen={showMeetingUrlModal}
                onClose={() => setShowMeetingUrlModal(false)}
                disableButtons={loading}
                onPressStartMeeting={(link) => _setMeetingLink(link)}
            />
        </>
    );
}

function StudentContactParticiantsAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'>; refresh: () => void }) {
    const toast = useToast();
    const { t } = useTranslation();
    const { sizes } = useTheme();

    const [showMessageModal, setShowMessageModal] = useState(false);

    const { data: participantsData } = useQuery(
        gql(`
        query SubcourseParticipantsForContact($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId) {
                participants { 
                    id
                    firstname
                    lastname
                }
            }
        }
    `),
        { variables: { subcourseId: subcourse.id } }
    );

    const [sendMessage, _sendMessage] = useMutation(
        gql(`
            mutation sendMessage($subject: String!, $message: String!, $subcourseId: Int!, $participants: [Int!]!) {
                subcourseNotifyParticipants(subcourseId: $subcourseId, title: $subject, body: $message, participantIDs: $participants, fileIDs: [])
            }
        `)
    );

    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const onSendMessage = useCallback(
        async (subject: string, message: string) => {
            if (subject && message && participantsData) {
                try {
                    await sendMessage({
                        variables: {
                            subject,
                            message,
                            subcourseId: subcourse.id,
                            participants: selectedParticipants.length ? selectedParticipants : participantsData.subcourse!.participants.map((it) => it.id),
                        },
                    });
                    toast.show({ description: 'Nachricht erfolgreich versendet', placement: 'top' });
                    setShowMessageModal(false);
                } catch (e) {
                    toast.show({
                        description: 'Deine Nachricht konnte nicht versendet werden',
                        placement: 'top',
                    });
                }
            }
        },
        [subcourse.id, sendMessage, toast, participantsData, selectedParticipants]
    );

    return (
        <>
            <Button onPress={() => setShowMessageModal(true)} width={ButtonContainer} variant="outline">
                {t('single.contact.participants')}
            </Button>
            <SendParticipantsMessageModal
                isInstructor={true}
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                onSend={onSendMessage}
                isDisabled={_sendMessage.loading}
                details={
                    <SelectParticipants
                        participants={participantsData?.subcourse!.participants ?? []}
                        selectedParticipants={selectedParticipants}
                        setSelectedParticipants={setSelectedParticipants}
                    />
                }
            />
        </>
    );
}

/* Submits the course for review courseState.created -> submitted,
   a Screener will review the course and then approve it courseState.allowed

   Note that this is executed on the Course, not the Subcourse! */
function StudentSubmitAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'> & { course?: Pick<Course, 'id'> | null }; refresh: () => void }) {
    const toast = useToast();
    const { sizes } = useTheme();
    const { t } = useTranslation();

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const [submit, { loading }] = useMutation(
        gql(`
        mutation CourseSubmit($courseId: Float!) { 
            courseSubmit(courseId: $courseId)
        }
    `),
        { variables: { courseId: subcourse!.course!.id } }
    );

    async function doSubmit() {
        await submit();
        toast.show({ description: 'Kurs zur Prüfung freigegeben', placement: 'top' });
        refresh();
    }

    return (
        <>
            <Button with={ButtonContainer} onPress={doSubmit} disabled={loading}>
                {t('course.CourseDate.Preview.publishCourse')}
            </Button>
        </>
    );
}

/* Publishes the Subourse - It will then be visible to pupils which can then join */
function StudentPublishAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'>; refresh: () => void }) {
    const toast = useToast();
    const { sizes } = useTheme();
    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const [publish, { loading }] = useMutation(
        gql(`
        mutation SubcoursePublish($subcourseId: Float!) {
            subcoursePublish(subcourseId: $subcourseId)
        }
    `),
        { variables: { subcourseId: subcourse.id } }
    );

    async function doPublish() {
        await publish();
        toast.show({ description: 'Kurs veröffentlicht - Schüler können ihn jetzt sehen', placement: 'top' });
        refresh();
    }

    return (
        <>
            <Button width={ButtonContainer} onPress={doPublish} disabled={loading}>
                Kurs veröffentlichen
            </Button>
        </>
    );
}

/* ------------- Pupil UI Elements -------------------- */
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
            {otherParticipants.map((participant) => (
                <ParticipantRow participant={participant} />
            ))}
        </>
    );
}

function PupilJoinCourseAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'>; refresh: () => void }) {
    const { t } = useTranslation();

    const [isSignedInModal, setSignedInModal] = useState(false);

    const { data: canJoinData } = useQuery(
        gql(`
        query CanJoin($subcourseId: Int!) { 
            subcourse(subcourseId: $subcourseId) {
                canJoin { allowed reason }
            }
        }
    `),
        { variables: { subcourseId: subcourse.id } }
    );

    const [joinSubcourse, { loading, data }] = useMutation(
        gql(`
            mutation SubcourseJoin($subcourseId: Float!) {
                subcourseJoin(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourse.id },
        }
    );

    useEffect(() => {
        if (data?.subcourseJoin) {
            setSignedInModal(true);
        }
    }, [data?.subcourseJoin]);

    const { space, sizes } = useTheme();
    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const buttonWrap = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    return (
        <>
            {!canJoinData?.subcourse!.canJoin.allowed && (
                <AlertMessage content={t(`lernfair.reason.course.pupil.${canJoinData?.subcourse!.canJoin?.reason}` as unknown as TemplateStringsArray)} />
            )}
            {canJoinData?.subcourse!.canJoin.allowed && (
                <Button
                    onPress={() => {
                        joinSubcourse();
                    }}
                    width={ButtonContainer}
                    marginBottom={space['0.5']}
                    isDisabled={loading}
                >
                    {t('signin')}
                </Button>
            )}
            <Modal
                isOpen={isSignedInModal}
                onClose={() => {
                    setSignedInModal(false);
                    refresh();
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast dich nun erfolgreich zum Kurs angemeldet.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedInModal(false);
                                        refresh();
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
}

function PupilLeaveCourseAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'>; refresh: () => void }) {
    const { t } = useTranslation();

    const [isSignedOutSureModal, setSignedOutSureModal] = useState(false);
    const [isSignedOutModal, setSignedOutModal] = useState(false);

    const [leaveSubcourse, { loading }] = useMutation(
        gql(`
            mutation LeaveSubcourse($subcourseId: Float!) {
                subcourseLeave(subcourseId: $subcourseId)
            }
        `),
        { variables: { subcourseId: subcourse.id } }
    );

    const { space, sizes } = useTheme();
    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const buttonWrap = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    return (
        <>
            <VStack space={space['0.5']}>
                <Button
                    onPress={() => {
                        setSignedOutSureModal(true);
                    }}
                    width={ButtonContainer}
                    marginBottom={space['0.5']}
                    isDisabled={loading}
                    variant="outline"
                >
                    Kurs verlassen
                </Button>

                <AlertMessage content={t('single.card.alreadyRegistered')} />
            </VStack>
            <Modal isOpen={isSignedOutSureModal} onClose={() => setSignedOutSureModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>
                            Bist du sicher, dass du dich von diesem Kurs abmelden möchtest? Du kannst anschließend nicht mehr am Kurs teilnehmen.
                        </Text>
                        <Row space="3" flexDir={buttonWrap} justifyContent="flex-end">
                            <Column>
                                <Button
                                    height="100%"
                                    colorScheme="blueGray"
                                    variant="ghost"
                                    onPress={() => {
                                        setSignedOutSureModal(false);
                                    }}
                                >
                                    {t('cancel')}
                                </Button>
                            </Column>
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedOutSureModal(false);
                                        leaveSubcourse();
                                        setSignedOutModal(true);
                                    }}
                                >
                                    Vom Kurs abmelden
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal
                isOpen={isSignedOutModal}
                onClose={() => {
                    setSignedOutModal(false);
                    refresh();
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast dich nun erfolgreich vom Kurs abgemeldet.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedOutModal(false);
                                        refresh();
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
}

function PupilLeaveWaitingListAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'>; refresh: () => void }) {
    const { t } = useTranslation();
    const [isLeaveWaitingListModal, setLeaveWaitingListModal] = useState(false);

    const [leaveWaitingList, { loading, data }] = useMutation(
        gql(`
            mutation LeaveWaitingList($subcourseId: Float!) {
                subcourseLeaveWaitinglist(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourse.id },
        }
    );

    useEffect(() => {
        if (data?.subcourseLeaveWaitinglist) {
            setLeaveWaitingListModal(true);
        }
    }, [data?.subcourseLeaveWaitinglist]);

    const { space, sizes } = useTheme();
    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    return (
        <>
            <VStack space={space['0.5']}>
                <AlertMessage content={t('single.card.alreadyRegistered')} />
                <Button
                    onPress={() => {
                        leaveWaitingList();
                    }}
                    width={ButtonContainer}
                    marginBottom={space['0.5']}
                    isDisabled={loading}
                >
                    Warteliste verlassen
                </Button>
            </VStack>
            <Modal
                isOpen={isLeaveWaitingListModal}
                onClose={() => {
                    setLeaveWaitingListModal(false);
                    refresh();
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast die Warteliste erfolgreich verlassen.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setLeaveWaitingListModal(false);
                                        refresh();
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
}

function PupilJoinWaitingListAction({ subcourse, refresh }: { subcourse: Pick<Subcourse, 'id'>; refresh: () => void }) {
    const [isOnWaitingListModal, setOnWaitingListModal] = useState(false);
    const [joinWaitingList, { data, loading }] = useMutation(
        gql(`
            mutation JoinWaitingList($subcourseId: Float!) {
                subcourseJoinWaitinglist(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourse.id },
        }
    );

    const { space, sizes } = useTheme();
    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    useEffect(() => {
        if (data?.subcourseJoinWaitinglist) {
            setOnWaitingListModal(true);
        }
    }, [data?.subcourseJoinWaitinglist]);

    return (
        <>
            <Button
                onPress={() => {
                    joinWaitingList();
                }}
                width={ButtonContainer}
                marginBottom={space['0.5']}
                isDisabled={loading}
            >
                Auf die Warteliste
            </Button>
            <Modal isOpen={isOnWaitingListModal} onClose={() => setOnWaitingListModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du bist auf der Warteliste!</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setOnWaitingListModal(false);
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
}

function PupilContactInstructors({ subcourse }: { subcourse: Pick<Subcourse, 'id'> }) {
    const [showMessageModal, setShowMessageModal] = useState(false);
    const { sizes } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const [contact, { loading }] = useMutation(
        gql(`
        mutation NotifyInstructors($subcourseId: Int!, $title: String!, $body: String!) {
            subcourseNotifyInstructor(subcourseId: $subcourseId fileIDs: [] title: $title body: $body)
        }
    `)
    );

    async function doContact(title: string, body: string) {
        await contact({ variables: { subcourseId: subcourse.id, title, body } });
        toast.show({ description: 'Benachrichtigung verschickt', placement: 'top' });
        setShowMessageModal(false);
    }

    return (
        <>
            <Button onPress={() => setShowMessageModal(true)} disabled={loading} width={ButtonContainer}>
                {t('single.contact.instructor')}
            </Button>
            <SendParticipantsMessageModal
                isInstructor={false}
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                onSend={doContact}
                isDisabled={loading}
            />
        </>
    );
}

/* ---------------- Course UI ---------------------- */

const SingleCourse: React.FC = () => {
    const userType = useUserType();
    const { space, sizes } = useTheme();
    const toast = useToast();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();

    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);

    console.log(userType);

    const singleSubcourseQuery = gql(`
    query GetSingleSubcourse($subcourseId: Int!, $isStudent: Boolean = false) {
        subcourse(subcourseId: $subcourseId){
            id
            participantsCount
            maxParticipants
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
    const { data, loading, refetch } = useQuery(singleSubcourseQuery, {
        variables: {
            subcourseId,
            isStudent: userType === 'student',
        },
    });

    const [promote, { error }] = useMutation(
        gql(`
    mutation subcoursePromote($subcourseId: Float!) {
        subcoursePromote(subcourseId: $subcourseId)
    }
`),
        { variables: { subcourseId: subcourseId } }
    );

    const { subcourse } = data ?? {};
    const { course } = subcourse ?? {};

    const doPromote = async () => {
        await promote();
        if (error) {
            toast.show({ description: t('single.buttonPromote.toastFail'), placement: 'top' });
        } else {
            toast.show({ description: t('single.buttonPromote.toast'), placement: 'top' });
        }
        refetch();
    };

    const isMatureForPromotion = (publishDate: string): boolean => {
        const { daysDiff } = getTimeDifference(publishDate);
        if (publishDate === null || daysDiff > 3) {
            return true;
        }
        return false;
    };

    const canPromoteCourse = () => {
        if (userType !== 'student' || loading || !subcourse || !subcourse.published || !subcourse?.isInstructor || !subcourse.hasOwnProperty('alreadyPromoted'))
            return false;
        return subcourse.capacity < 0.75 && isMatureForPromotion(subcourse.publishedAt);
    };

    const courseFull = (subcourse?.participantsCount ?? 0) >= (subcourse?.maxParticipants ?? 0);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const imageHeight = useBreakpointValue({
        base: '178px',
        lg: '260px',
    });

    const buttonWrap = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    useEffect(() => {
        trackPageView({
            documentTitle: course?.name,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                    <Text bold>{t('single.global.duration')}: </Text>{' '}
                                    {(typeof lecture?.duration !== 'number' ? parseInt(lecture?.duration) : lecture?.duration) / 60} {t('single.global.hours')}
                                </Text>
                            </Row>
                        ))) || <Text>{t('single.global.noLections')}</Text>}
                </>
            ),
        },
    ];

    if (subcourse?.isInstructor || subcourse?.isParticipant) {
        tabs.push({
            title: t('single.tabs.participant'),
            content: (
                <>
                    {subcourse?.isParticipant && <OtherParticipants subcourseId={subcourseId} />}
                    {subcourse?.isInstructor && <Participants subcourseId={subcourseId} />}
                </>
            ),
        });
    }

    return (
        <>
            <WithNavigation headerTitle={course?.name.substring(0, 20)} showBack isLoading={loading} headerLeft={<NotificationAlert />}>
                <Box paddingX={space['1.5']} maxWidth={ContainerWidth} marginX="auto" width="100%">
                    <Box maxWidth={sizes['imageHeaderWidth']} height={imageHeight} marginBottom={space['1.5']}>
                        <Image
                            alt={course?.name}
                            borderRadius="8px"
                            position="absolute"
                            w="100%"
                            height="100%"
                            bgColor="gray.300"
                            source={{
                                uri: course?.image!,
                            }}
                        />
                    </Box>
                    <Box paddingBottom={space['0.5']} maxWidth={sizes['imageHeaderWidth']}>
                        <Row>
                            {course?.tags?.map((tag) => (
                                <Column marginRight={space['0.5']}>
                                    <Tag text={tag.name} />
                                </Column>
                            ))}
                        </Row>
                    </Box>
                    {(subcourse?.lectures.length ?? 0) > 0 && (
                        <Text paddingBottom={space['0.5']} maxWidth={sizes['imageHeaderWidth']}>
                            {t('single.global.clockFrom')} {Utility.formatDate(subcourse?.lectures[0].start)} {t('single.global.clock')}
                        </Text>
                    )}
                    <Heading paddingBottom={space['1']}>{course?.name}</Heading>
                    <Row alignItems="center" paddingBottom={space['1']}>
                        {subcourse?.instructors && subcourse?.instructors[0] && (
                            <Heading fontSize="md">{subcourse?.instructors.map((it) => `${it.firstname} ${it.lastname}`).join(', ')}</Heading>
                        )}
                    </Row>
                    <Box my={2}>
                        {subcourse && subcourse.published && !isInPast && (
                            <PromoteBanner
                                onClick={doPromote}
                                canPromote={canPromoteCourse()}
                                isPromoted={subcourse?.alreadyPromoted || false}
                                courseStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
                            />
                        )}
                    </Box>

                    <Box>
                        {subcourse && course!.courseState === 'allowed' && !subcourse.published && (
                            <StudentPublishAction subcourse={subcourse} refresh={refetch} />
                        )}
                        {subcourse && course!.courseState === 'created' && <StudentSubmitAction subcourse={subcourse} refresh={refetch} />}
                        {subcourse && subcourse.published && (subcourse.isInstructor || subcourse.isParticipant) && (
                            <JoinMeetingAction subcourse={subcourse} refresh={refetch} />
                        )}

                        {subcourse && userType === 'student' && subcourse.isInstructor && <StudentEditCourseAction subcourse={subcourse} isInPast={isInPast} />}
                        {subcourse && userType === 'student' && subcourse.isInstructor && subcourse.published && (
                            <StudentContactParticiantsAction subcourse={subcourse} refresh={refetch} />
                        )}
                        {subcourse && userType === 'student' && subcourse.isInstructor && (
                            <StudentSetMeetingUrlAction subcourse={subcourse} refresh={refetch} />
                        )}

                        {subcourse && userType === 'pupil' && subcourse.isParticipant && course?.allowContact && (
                            <PupilContactInstructors subcourse={subcourse} />
                        )}
                        {subcourse && userType === 'pupil' && !subcourse.isParticipant && <PupilJoinCourseAction subcourse={subcourse} refresh={refetch} />}
                        {subcourse && userType === 'pupil' && subcourse.isParticipant && <PupilLeaveCourseAction subcourse={subcourse} refresh={refetch} />}

                        {subcourse && userType === 'pupil' && !subcourse.isParticipant && courseFull && !subcourse.isOnWaitingList && (
                            <PupilJoinWaitingListAction subcourse={subcourse} refresh={refetch} />
                        )}
                        {subcourse && userType === 'pupil' && subcourse.isOnWaitingList && (
                            <PupilLeaveWaitingListAction subcourse={subcourse} refresh={refetch} />
                        )}
                    </Box>
                    <Tabs tabs={tabs} />
                </Box>
            </WithNavigation>
        </>
    );
};
export default SingleCourse;
