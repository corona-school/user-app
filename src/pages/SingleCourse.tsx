import { Box, Heading, useTheme, Text, Image, Column, Row, Button, useBreakpointValue, VStack, Modal, useToast, Tooltip } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Tabs, { Tab } from '../components/Tabs';
import Tag from '../components/Tag';
import WithNavigation from '../components/WithNavigation';
import { LFLecture, LFSubCourse, LFTag } from '../types/lernfair/Course';
import CourseTrafficLamp from '../widgets/CourseTrafficLamp';

import Utility, { getFirstLectureFromSubcourse, getTrafficStatus } from '../Utility';
import { gql } from './../gql';
import { useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Participant as LFParticipant } from '../types/lernfair/User';
import AlertMessage from '../widgets/AlertMessage';
import { useUser, useUserType } from '../hooks/useApollo';

import { getSchoolTypeKey } from '../types/lernfair/SchoolType';
import SetMeetingLinkModal from '../modals/SetMeetingLinkModal';
import SendParticipantsMessageModal from '../modals/SendParticipantsMessageModal';
import CancelSubCourseModal from '../modals/CancelSubCourseModal';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { Participant } from '../gql/graphql';

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

/* function JoinMeetingAction() {
        const disableMeetingButton: boolean = useMemo(() => {
        return DateTime.fromISO(course?.nextLecture?.start).diffNow('minutes').minutes > 60;
    }, [course]);
    const [showMeetingNotStarted, setShowMeetingNotStarted] = useState<boolean>();
    const [showMeetingButton, setShowMeetingButton] = useState<boolean>(false);

    const getMeetingLink = useCallback(async () => {
        try {
            const res = await joinMeeting({ variables: { subcourseId } });

            if (res.data.subcourseJoinMeeting) {
                window.open(res.data.subcourseJoinMeeting, '_blank');
            } else {
                setShowMeetingNotStarted(true);
            }
        } catch (e) {
            setShowMeetingNotStarted(true);
        }
    }, [courseId, joinMeeting]);

    return <>
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
                            leaveSubcourse({ variables: { subcourseId } });
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
    </>;
} */

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

/* function StudentActions() {
    const [cancelSubcourse] = useMutation(gql(`mutation CancelSubcourse {
        subcourseCancel(subcourseId: ${courseId})
      }`));

const [setMeetingUrl, _setMeetingUrl] = useMutation(gql(`
mutation setMeetingUrl($subcourseId: Float!, $meetingUrl: String!) {
    subcourseSetMeetingURL(subcourseId: $subcourseId, meetingURL: $meetingUrl)
}
`));

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

const [sendMessage, _sendMessage] = useMutation(
    gql(`
        mutation sendMessage($subject: String!, $message: String!, $subcourseId: Int!, $participants: [Int!]!) {
            subcourseNotifyParticipants(subcourseId: $subcourseId, title: $subject, body: $message, participantIDs: $participants, fileIDs: [])
        }
    `)
);

const onSendMessage = useCallback(
    async (subject: string, message: string) => {
        if (subject && message && participants) {
            const ps = participants.map((p) => p.id);

            try {
                await sendMessage({
                    variables: {
                        subject,
                        message,
                        subcourseId,
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

    const cancelCourse = useCallback(async () => {
        try {
            await cancelSubcourse();
            toast.show({ description: 'Der Kurs wurde erfolgreich abgesagt' });
        } catch (e) {
            toast.show({ description: 'Der Kurs konnte nicht abgesagt werden' });
        }
        setShowCancelModal(false);
    }, [cancelSubcourse, toast]);

      return 
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
  </VStack>
} */

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

/* function PupilActions() {
    const [isSignedOutSureModal, setSignedOutSureModal] = useState(false);
    const [isSignedOutModal, setSignedOutModal] = useState(false);
    const [isOnWaitingListModal, setOnWaitingListModal] = useState(false);
    const [isLeaveWaitingListModal, setLeaveWaitingListModal] = useState(false);

    const [joinMeeting, _joinMeeting] = useMutation(gql(`mutation{
        subcourseJoinMeeting(subcourseId: ${subcourseId})
      }`));
    
        const [joinSubcourse, _joinSubcourse] = useMutation(
            gql(`
                mutation ($courseId: Float!) {
                    subcourseJoin(subcourseId: $courseId)
                }
            `),
            {
                refetchQueries: [query, participantQuery],
            }
        );
    
        const [leaveSubcourse] = useMutation(
            gql(`
                mutation ($courseId: Float!) {
                    subcourseLeave(subcourseId: $courseId)
                }
            `),
            {
                refetchQueries: [query, participantQuery],
            }
        );
        const [joinWaitingList, _joinWaitingList] = useMutation(
            gql(`
                mutation ($courseId: Float!) {
                    subcourseJoinWaitinglist(subcourseId: $courseId)
                }
            `),
            {
                refetchQueries: [query, participantQuery],
            }
        );
        const [leaveWaitingList, _leaveWaitingList] = useMutation(
            gql(`
                mutation ($courseId: Float!) {
                    subcourseLeaveWaitinglist(subcourseId: $courseId)
                }
            `),
            {
                refetchQueries: [query, participantQuery],
            }
        );

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

        return <>
                                <Box marginBottom={space['0.5']} maxWidth={sizes['imageHeaderWidth']}>
                            {!course?.canJoin?.allowed && !course?.isParticipant && (
                                <AlertMessage content={t(`lernfair.reason.${course?.canJoin?.reason}.coursetext`)} />
                            )}
                            {!course?.isParticipant && !course?.isOnWaitingList && (
                                <Button
                                    onPress={() => {
                                        joinSubcourse({ variables: { subcourseId } });
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
                                            variables: { subcourseId },
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
                                            leaveWaitingList({ variables: { subcourseId } });
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
        </>;
} */

/* ---------------- Course UI ---------------------- */

const SingleCourse: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();

    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);

    const { data, loading } = useQuery(
        gql(`query GetSingleSubcourse($subcourseId: Int!) {
        subcourse(subcourseId: $subcourseId){
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

            isInstructor
            isParticipant
        }
    }`),
        { variables: { subcourseId } }
    );

    const { subcourse } = data ?? {};
    const { course } = subcourse ?? {};

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
            <WithNavigation headerTitle={course?.name.substring(0, 20)} showBack isLoading={loading}>
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

                    <Box marginBottom={space['1']}>
                        {subcourse && <CourseTrafficLamp status={getTrafficStatus(subcourse!.participantsCount, subcourse!.maxParticipants)} />}
                    </Box>
                    <Tabs tabs={tabs} />
                </Box>
            </WithNavigation>
        </>
    );
};
export default SingleCourse;
