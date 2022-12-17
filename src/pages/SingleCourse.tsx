import { Box, Heading, useTheme, Text, Image, Column, Row, Button, useBreakpointValue, VStack, Modal, useToast, Tooltip } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Tabs from '../components/Tabs';
import Tag from '../components/Tag';
import WithNavigation from '../components/WithNavigation';
import { LFLecture, LFSubCourse, LFTag } from '../types/lernfair/Course';
import CourseTrafficLamp from '../widgets/CourseTrafficLamp';

import Utility, { getFirstLectureFromSubcourse, getTrafficStatus } from '../Utility';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Participant as LFParticipant } from '../types/lernfair/User';
import AlertMessage from '../widgets/AlertMessage';
import { useUserType } from '../hooks/useApollo';

import { getSchoolTypeKey } from '../types/lernfair/SchoolType';
import SetMeetingLinkModal from '../modals/SetMeetingLinkModal';
import SendParticipantsMessageModal from '../modals/SendParticipantsMessageModal';
import CancelSubCourseModal from '../modals/CancelSubCourseModal';

const SingleCourse: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { trackPageView, trackEvent } = useMatomo();
    const toast = useToast();

    const [loadParticipants, setLoadParticipants] = useState<boolean>();
    const [isSignedInModal, setSignedInModal] = useState(false);
    const [isSignedOutSureModal, setSignedOutSureModal] = useState(false);
    const [isSignedOutModal, setSignedOutModal] = useState(false);
    const [isOnWaitingListModal, setOnWaitingListModal] = useState(false);
    const [isLeaveWaitingListModal, setLeaveWaitingListModal] = useState(false);
    const [showMeetingUrlModal, setShowMeetingUrlModal] = useState<boolean>(false);
    const [showMeetingNotStarted, setShowMeetingNotStarted] = useState<boolean>();
    const [showMeetingButton, setShowMeetingButton] = useState<boolean>(false);
    const [showMessageModal, setShowMessageModal] = useState<boolean>(false);

    const navigate = useNavigate();
    const { id: courseId } = useParams();
    const userType = useUserType();
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

    const userQuery =
        userType === 'student'
            ? `
      isInstructor
      participants{
        id
    firstname
    lastname
    grade
    schooltype
  }`
            : `
  isOnWaitingList
  isParticipant 
  canJoin{
    allowed
    reason
    limit
  }`;

    const query = gql`query{
    me {
      pupil{id firstname grade}
      student{id}
    }
    subcourse(subcourseId: ${courseId}){
      id
      participantsCount
      maxParticipants
      nextLecture{
        start
        duration
      }
      instructors{
        firstname
        lastname
      }
      ${userQuery}
      course {
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
    }
  }`;

    const participantQuery = gql`
  query{
    subcourse(subcourseId: ${courseId}){
      otherParticipants{
        firstname
        grade
      }
    }
  }`;

    const { data: courseData, loading } = useQuery(query);

    const { data: participantData } = useQuery(participantQuery, {
        skip: !loadParticipants,
    });

    const [joinMeeting, _joinMeeting] = useMutation(gql`mutation{
    subcourseJoinMeeting(subcourseId: ${courseId})
  }`);

    const [joinSubcourse, _joinSubcourse] = useMutation(
        gql`
            mutation ($courseId: Float!) {
                subcourseJoin(subcourseId: $courseId)
            }
        `,
        {
            refetchQueries: [query, participantQuery],
        }
    );

    const [leaveSubcourse] = useMutation(
        gql`
            mutation ($courseId: Float!) {
                subcourseLeave(subcourseId: $courseId)
            }
        `,
        {
            refetchQueries: [query, participantQuery],
        }
    );
    const [joinWaitingList, _joinWaitingList] = useMutation(
        gql`
            mutation ($courseId: Float!) {
                subcourseJoinWaitinglist(subcourseId: $courseId)
            }
        `,
        {
            refetchQueries: [query, participantQuery],
        }
    );
    const [leaveWaitingList, _leaveWaitingList] = useMutation(
        gql`
            mutation ($courseId: Float!) {
                subcourseLeaveWaitinglist(subcourseId: $courseId)
            }
        `,
        {
            refetchQueries: [query, participantQuery],
        }
    );

    const [cancelSubcourse] = useMutation(gql`mutation CancelSubcourse {
    subcourseCancel(subcourseId: ${courseId})
  }`);

    useEffect(() => {
        if (_joinSubcourse?.data?.subcourseJoin) {
            setSignedInModal(true);
        }
    }, [_joinSubcourse?.data?.subcourseJoin]);

    useEffect(() => {
        if (_joinWaitingList?.data?.subcourseJoinWaitinglist) {
            setOnWaitingListModal(true);
        }
    }, [_joinWaitingList?.data?.subcourseJoinWaitinglist]);

    useEffect(() => {
        if (_leaveWaitingList?.data?.subcourseLeaveWaitinglist) {
            setLeaveWaitingListModal(true);
        }
    }, [_leaveWaitingList?.data?.subcourseLeaveWaitinglist]);

    const course = useMemo(() => courseData?.subcourse, [courseData]);

    const participants: LFParticipant[] = useMemo(() => {
        if (userType === 'student') {
            return course?.participants;
        } else {
            if (course?.isParticipant) {
                return participantData?.subcourse?.otherParticipants;
            }
        }
    }, [userType, course?.participants, course?.isParticipant, participantData?.subcourse?.otherParticipants]);

    const isFull = useMemo(() => course?.participantsCount >= course?.maxParticipants, [course?.maxParticipants, course?.participantsCount]);

    const [sendMessage, _sendMessage] = useMutation(
        gql`
            mutation sendMessage($subject: String!, $message: String!, $subcourseId: Int!, $participants: [Int!]!) {
                subcourseNotifyParticipants(subcourseId: $subcourseId, title: $subject, body: $message, participantIDs: $participants, fileIDs: [])
            }
        `
    );

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
            documentTitle: course?.course?.name,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!loading && course) {
            course?.isParticipant && setLoadParticipants(true);
        }
    }, [course, loading]);

    const onSendMessage = useCallback(
        async (subject: string, message: string) => {
            if (subject && message && participants) {
                const ps = participants.map((p) => p.id);

                try {
                    await sendMessage({
                        variables: {
                            subject,
                            message,
                            subcourseId: courseId,
                            participants: ps,
                        },
                    });
                    toast.show({ description: 'Nachricht erfolgreich versendet' });
                    setShowMessageModal(false);
                } catch (e) {
                    toast.show({
                        description: 'Deine Nachricht konnte nicht versendet werden',
                    });
                }
            }
        },
        [courseId, participants, sendMessage, toast]
    );

    const getMeetingLink = useCallback(async () => {
        try {
            const res = await joinMeeting({ variables: { subcourseId: courseId } });

            if (res.data.subcourseJoinMeeting) {
                window.open(res.data.subcourseJoinMeeting, '_blank');
            } else {
                setShowMeetingNotStarted(true);
            }
        } catch (e) {
            setShowMeetingNotStarted(true);
        }
    }, [courseId, joinMeeting]);

    useEffect(() => {
        if (!courseId || !course?.lectures) return;
        const lec = getFirstLectureFromSubcourse(course?.lectures, false);
        if (!lec) return;
        if (DateTime.fromISO(lec.start).diffNow('minutes').minutes <= 5) {
            setShowMeetingButton(true);
        }
    }, [course?.lectures, courseId, getMeetingLink]);

    const [setMeetingUrl, _setMeetingUrl] = useMutation(gql`
        mutation setMeetingUrl($courseId: Float!, $meetingUrl: String!) {
            subcourseSetMeetingURL(subcourseId: $courseId, meetingURL: $meetingUrl)
        }
    `);

    const _setMeetingLink = useCallback(
        async (link: string) => {
            try {
                const res = await setMeetingUrl({
                    variables: {
                        courseId: courseData.subcourse.id,
                        meetingUrl: link,
                    },
                });

                setShowMeetingUrlModal(false);
                if (res.data.subcourseSetMeetingURL && !res.errors) {
                    toast.show({
                        description: t('course.meeting.result.success'),
                    });
                } else {
                    toast.show({
                        description: t('course.meeting.result.error'),
                    });
                }
            } catch (e) {
                toast.show({
                    description: t('course.meeting.result.error'),
                });
            }
        },
        [courseData?.subcourse?.id, setMeetingUrl, t, toast]
    );

    const disableMeetingButton: boolean = useMemo(() => {
        return DateTime.fromISO(course?.nextLecture?.start).diffNow('minutes').minutes > 60;
    }, [course]);

    const cancelCourse = useCallback(async () => {
        try {
            await cancelSubcourse();
            toast.show({ description: 'Der Kurs wurde erfolgreich abgesagt' });
        } catch (e) {
            toast.show({ description: 'Der Kurs konnte nicht abgesagt werden' });
        }
        setShowCancelModal(false);
    }, [cancelSubcourse, toast]);

    return (
        <>
            <WithNavigation
                headerTitle={course?.course?.name.length > 20 ? course?.course?.name.substring(0, 20) : course?.course?.name}
                showBack
                isLoading={loading}
            >
                <Box paddingX={space['1.5']} maxWidth={ContainerWidth} marginX="auto" width="100%">
                    <Box maxWidth={sizes['imageHeaderWidth']} height={imageHeight} marginBottom={space['1.5']}>
                        <Image
                            alt={course?.course?.name}
                            borderRadius="8px"
                            position="absolute"
                            w="100%"
                            height="100%"
                            bgColor="gray.300"
                            source={{
                                uri: course?.course?.image,
                            }}
                        />
                    </Box>
                    <Box paddingBottom={space['0.5']} maxWidth={sizes['imageHeaderWidth']}>
                        <Row>
                            {course?.course?.tags?.map((tag: LFTag) => (
                                <Column marginRight={space['0.5']}>
                                    <Tag text={tag.name} />
                                </Column>
                            ))}
                        </Row>
                    </Box>
                    {course?.lectures.length > 0 && (
                        <Text paddingBottom={space['0.5']} maxWidth={sizes['imageHeaderWidth']}>
                            {t('single.global.clockFrom')} {Utility.formatDate(course?.lectures[0].start)} {t('single.global.clock')}
                        </Text>
                    )}
                    <Heading paddingBottom={space['1']}>{course?.course?.name}</Heading>
                    <Row alignItems="center" paddingBottom={space['1']}>
                        {course?.instructors && course?.instructors[0] && (
                            <Heading fontSize="md">
                                {course?.instructors[0].firstname} {course?.instructors[0].lastname}
                            </Heading>
                        )}
                    </Row>

                    <Box marginBottom={space['1']}>
                        <CourseTrafficLamp status={getTrafficStatus(course?.participantsCount, course?.maxParticipants)} />
                    </Box>
                    {userType === 'pupil' && course?.isParticipant && (
                        <VStack space={space['0.5']} py={space['1']} maxWidth={ContainerWidth}>
                            <Tooltip isDisabled={!disableMeetingButton} maxWidth={300} label={t('course.meeting.hint.pupil')}>
                                <Button width={ButtonContainer} onPress={getMeetingLink} isDisabled={!showMeetingButton || _joinMeeting.loading}>
                                    Videochat beitreten
                                </Button>
                            </Tooltip>
                            {showMeetingNotStarted && <AlertMessage content="Der Videochat wurde noch nicht gestartet." />}
                        </VStack>
                    )}
                    {userType === 'student' && course?.isInstructor && (
                        <VStack space={space['0.5']} py={space['1']} maxWidth={ContainerWidth}>
                            <Tooltip isDisabled={!disableMeetingButton} maxWidth={300} label={t('course.meeting.hint.student')}>
                                <Button
                                    width={ButtonContainer}
                                    onPress={() => setShowMeetingUrlModal(true)}
                                    isDisabled={disableMeetingButton || _setMeetingUrl.loading}
                                >
                                    Videochat starten
                                </Button>
                            </Tooltip>
                        </VStack>
                    )}
                    {userType === 'pupil' && (
                        <Box marginBottom={space['0.5']} maxWidth={sizes['imageHeaderWidth']}>
                            {!course?.canJoin?.allowed && !course?.isParticipant && (
                                <AlertMessage content={t(`lernfair.reason.${course?.canJoin?.reason}.coursetext`)} />
                            )}
                            {!course?.isParticipant && !course?.isOnWaitingList && (
                                <Button
                                    onPress={() => {
                                        joinSubcourse({ variables: { courseId: courseId } });
                                    }}
                                    width={ButtonContainer}
                                    marginBottom={space['0.5']}
                                    isDisabled={!course?.canJoin?.allowed || _joinSubcourse.loading}
                                >
                                    {t('single.button.login')}
                                </Button>
                            )}
                            {!course?.isParticipant && isFull && (
                                <Button
                                    onPress={() => {
                                        joinWaitingList({
                                            variables: { courseId: courseId },
                                        });
                                    }}
                                    width={ButtonContainer}
                                    marginBottom={space['0.5']}
                                    isDisabled={!course?.canJoin?.allowed || loading}
                                >
                                    Auf die Warteliste
                                </Button>
                            )}
                            {course?.isOnWaitingList && (
                                <VStack space={space['0.5']}>
                                    <AlertMessage content={t('single.buttoninfo.waitingListMember')} />
                                    <Button
                                        onPress={() => {
                                            leaveWaitingList({ variables: { courseId: courseId } });
                                        }}
                                        width={ButtonContainer}
                                        marginBottom={space['0.5']}
                                        isDisabled={loading}
                                    >
                                        Warteliste verlassen
                                    </Button>
                                </VStack>
                            )}
                            {course?.isParticipant && (
                                <VStack space={space['0.5']}>
                                    <Button
                                        onPress={() => {
                                            setSignedOutSureModal(true);
                                        }}
                                        width={ButtonContainer}
                                        marginBottom={space['0.5']}
                                        isDisabled={loading}
                                    >
                                        Kurs verlassen
                                    </Button>

                                    <AlertMessage content={t('single.buttoninfo.successMember')} />
                                </VStack>
                            )}
                        </Box>
                    )}

                    {userType === 'student' && course?.isInstructor && (
                        <VStack marginBottom={space['1.5']} space={space['1']}>
                            <Button onPress={() => setShowMessageModal(true)} width={ButtonContainer} variant="outline">
                                Teilnehmer:innen kontaktieren
                            </Button>
                            <Button
                                onPress={() => {
                                    navigate('/edit-course', {
                                        state: { courseId: courseData.subcourse.id },
                                    });
                                }}
                                width={ButtonContainer}
                                variant="outline"
                            >
                                Kurs editieren
                            </Button>
                            <Button onPress={() => setShowCancelModal(true)} width={ButtonContainer} variant="outline">
                                Kurs absagen
                            </Button>
                        </VStack>
                    )}

                    {course?.course?.allowContact && (
                        <Box marginBottom={space['1.5']}>
                            <Button
                                onPress={() => {
                                    window.location.href = 'mailto:testing@lernfair.de?subject=Kontaktaufnahme';
                                    trackEvent({
                                        category: 'kurs',
                                        action: 'click-event',
                                        name: 'Kurs Kontakt | ' + course?.course?.name,
                                        documentTitle: 'Kurs Kontakt  | ' + course?.course?.name,
                                    });
                                }}
                                width={ButtonContainer}
                                variant="outline"
                            >
                                {t('single.button.contact')}
                            </Button>
                        </Box>
                    )}

                    <Tabs
                        tabs={[
                            {
                                title: t('single.tabs.description'),
                                content: (
                                    <>
                                        <Text maxWidth={sizes['imageHeaderWidth']} marginBottom={space['1']}>
                                            {course?.course?.description}
                                        </Text>
                                    </>
                                ),
                            },
                            {
                                title: t('single.tabs.lessons'),
                                content: (
                                    <>
                                        {(course?.lectures?.length > 0 &&
                                            course.lectures.map((lec: LFLecture, i: number) => (
                                                <Row maxWidth={sizes['imageHeaderWidth']} flexDirection="column" marginBottom={space['1.5']}>
                                                    <Heading paddingBottom={space['0.5']} fontSize="md">
                                                        {t('single.global.lesson')} {`${i + 1}`.padStart(2, '0')}
                                                    </Heading>
                                                    <Text paddingBottom={space['0.5']}>
                                                        {DateTime.fromISO(lec.start).toFormat('dd.MM.yyyy')}
                                                        <Text marginX="3px">•</Text>
                                                        {DateTime.fromISO(lec.start).toFormat('HH:mm')} {t('single.global.clock')}
                                                    </Text>
                                                    <Text>
                                                        <Text bold>{t('single.global.duration')}: </Text>{' '}
                                                        {(typeof lec?.duration !== 'number' ? parseInt(lec?.duration) : lec?.duration) / 60}{' '}
                                                        {t('single.global.hours')}
                                                    </Text>
                                                </Row>
                                            ))) || <Text>{t('single.global.noLections')}</Text>}
                                    </>
                                ),
                            },
                            (course?.isParticipant || course?.isInstructor) && {
                                title: t('single.tabs.participant'),
                                content: (
                                    <>
                                        {course?.isParticipant && <Participant pupil={courseData.me.pupil} />}
                                        {(participants?.length > 0 && participants.map((p: LFParticipant) => <Participant pupil={p} />)) || (
                                            <Text>{t('single.global.noMembers')}</Text>
                                        )}
                                    </>
                                ),
                            },
                        ]}
                    />
                </Box>
            </WithNavigation>
            {/* loggin  */}
            <Modal isOpen={isSignedInModal} onClose={() => setSignedInModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast dich nun erfolgreich zum Kurs angemeldet.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedInModal(false);
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {/* loggout sure  */}
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
                                    Abbrechen
                                </Button>
                            </Column>
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedOutSureModal(false);
                                        leaveSubcourse({ variables: { courseId: courseId } });
                                        setSignedOutModal(false);
                                    }}
                                >
                                    Vom Kurs abmelden
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {/* loggout  */}
            <Modal isOpen={isSignedOutModal} onClose={() => setSignedOutModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast dich nun erfolgreich zum Kurs abgemeldet.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedOutModal(false);
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {/* waitinglist */}
            <Modal isOpen={isOnWaitingListModal} onClose={() => setOnWaitingListModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast dich nun erfolgreich zum Kurs abgemeldet.</Text>
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
            {/* waitinglist */}
            <Modal isOpen={isOnWaitingListModal} onClose={() => setOnWaitingListModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast dich erfolgreich auf die Warteliste angemeldet.</Text>
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
            {/* leave waitinglist */}
            <Modal isOpen={isLeaveWaitingListModal} onClose={() => setLeaveWaitingListModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast die Warteliste erfolgreich verlassen.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setLeaveWaitingListModal(false);
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <SetMeetingLinkModal
                isOpen={showMeetingUrlModal}
                onClose={() => setShowMeetingUrlModal(false)}
                disableButtons={_setMeetingUrl.loading}
                onPressStartMeeting={(link) => _setMeetingLink(link)}
            />
            <SendParticipantsMessageModal
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                onSend={onSendMessage}
                isDisabled={_sendMessage.loading}
            />
            <CancelSubCourseModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onCourseCancel={cancelCourse} />
        </>
    );
};
export default SingleCourse;

type ParticipantProps = {
    pupil: LFParticipant;
};
const Participant: React.FC<ParticipantProps> = ({ pupil }) => {
    const { space } = useTheme();
    return (
        <Row marginBottom={space['1.5']} alignItems="center">
            <Column marginRight={space['1']}></Column>
            <Column>
                <Heading fontSize="md">
                    {pupil.firstname} {pupil.lastname}
                </Heading>
                <Text>
                    {pupil.schooltype && `${getSchoolTypeKey(pupil.schooltype)}, `}
                    {pupil.grade}
                </Text>
            </Column>
        </Row>
    );
};
