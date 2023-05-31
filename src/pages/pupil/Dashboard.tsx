import { Text, Button, Heading, HStack, useTheme, VStack, useBreakpointValue, Flex, useToast, Alert, Column, Box, Tooltip, Stack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';
import SignInCard from '../../widgets/SignInCard';
import WithNavigation from '../../components/WithNavigation';
import { useNavigate } from 'react-router-dom';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { LFLecture } from '../../types/lernfair/Course';
import { DEACTIVATE_PUPIL_MATCH_REQUESTS } from '../../config';

import { DateTime } from 'luxon';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';

import AsNavigationItem from '../../components/AsNavigationItem';
import DissolveMatchModal from '../../modals/DissolveMatchModal';
import Hello from '../../widgets/Hello';
import AlertMessage from '../../widgets/AlertMessage';
import CancelMatchRequestModal from '../../modals/CancelMatchRequestModal';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import LearningPartner from '../../widgets/LearningPartner';
import ImportantInformation from '../../widgets/ImportantInformation';
import { gql } from '../../gql';
import { PupilDashboardQuery } from '../../gql/graphql';
import HelpNavigation from '../../components/HelpNavigation';

type Props = {};

const query = gql(`
    query PupilDashboard {
        me {
            firstname
            pupil {
                matches {
                    id
                    uuid
                    dissolved
                    subjectsFormatted {
                        name
                    }
                    student {
                        id
                        firstname
                        lastname
                    }
                    studentEmail
                }
                firstMatchRequest
                openMatchRequestCount
                canRequestMatch {
                    allowed
                    reason
                    limit
                }
                canJoinSubcourses {
                    allowed
                    reason
                    limit
                }
                subcoursesJoined {
                    id
                    isParticipant
                    minGrade
                    maxGrade
                    participantsCount
                    maxParticipants
                    lectures {
                        start
                        duration
                    }
                    course {
                        courseState
                        name
                        image
                        tags {
                            name
                        }
                        subject
                        description
                    }
                    published
                    cancelled
                }
            }
        }

        subcoursesPublic(take: 10, skip: 0, excludeKnown: true, onlyJoinable: true) {
            id
            minGrade
            maxGrade
            joinAfterStart
            maxParticipants
            participantsCount

            course {
                name
                description
                image
                tags {
                    name
                }
            }
            lectures {
                start
                duration
            }
            firstLecture { start duration }
        }

        myRoles
    }
`);

type JoinedSubcourse = Exclude<PupilDashboardQuery['me']['pupil'], null | undefined>['subcoursesJoined'][number];

const Dashboard: React.FC<Props> = () => {
    const { data, loading, called } = useQuery(query);

    const { space, sizes } = useTheme();
    const toast = useToast();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { trackPageView, trackEvent } = useMatomo();
    const [showDissolveModal, setShowDissolveModal] = useState<boolean>(false);
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [dissolveData, setDissolveData] = useState<{ id: number }>();
    const [toastShown, setToastShown] = useState<boolean>();
    const [showMeetingNotStarted, setShowMeetingNotStarted] = useState<boolean>();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler – Dashboard',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const CardGrid = useBreakpointValue({
        base: '100%',
        lg: '46%',
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const sortedAppointments = useMemo(() => {
        const lectures: { subcourse: JoinedSubcourse; lecture: LFLecture }[] = [];

        if (!data?.me?.pupil?.subcoursesJoined) return [];

        for (const subcourse of data?.me?.pupil?.subcoursesJoined) {
            const futureAndOngoingLectures = subcourse.lectures.filter(
                (lecture) => DateTime.now().toMillis() < DateTime.fromISO(lecture.start).toMillis() + 1000 * 60 * lecture.duration
            );

            for (const lecture of futureAndOngoingLectures) {
                lectures.push({ lecture, subcourse });
            }
        }

        return lectures.sort((a, b) => {
            const _a = DateTime.fromISO(a.lecture.start).toMillis();
            const _b = DateTime.fromISO(b.lecture.start).toMillis();

            return _a - _b;
        });
    }, [data?.me?.pupil?.subcoursesJoined]);

    const highlightedAppointment: { subcourse: JoinedSubcourse; lecture: LFLecture } | undefined = useMemo(() => sortedAppointments[0], [sortedAppointments]);

    const [cancelMatchRequest, _cancelMatchRequest] = useMutation(
        gql(`
            mutation cancelMatchRequest {
                pupilDeleteMatchRequest
            }
        `),
        {
            refetchQueries: [query],
        }
    );

    const cancelMatchRequestReaction = useCallback(
        (shareFeedback: boolean, feedback?: string) => {
            trackEvent({
                category: 'Schüler',
                action: 'Match Request zurückgezogen',
                name: 'Schüler - Dashboard',
            });

            cancelMatchRequest();
            setShowCancelModal(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [cancelMatchRequest]
    );

    const [dissolve, _dissolve] = useMutation(
        gql(`
            mutation dissolveMatchPupil($matchId: Float!, $dissolveReason: Float!) {
                matchDissolve(dissolveReason: $dissolveReason, matchId: $matchId)
            }
        `),
        {
            refetchQueries: [query],
        }
    );

    const [joinMeeting, _joinMeeting] = useMutation(
        gql(`
        mutation joinMeetingPupil($subcourseId: Float!) {
            subcourseJoinMeeting(subcourseId: $subcourseId)
        }
    `)
    );

    const dissolveMatch = useCallback((match: { id: number }) => {
        setDissolveData(match);
        setShowDissolveModal(true);
    }, []);

    useEffect(() => {
        if (_dissolve?.data?.matchDissolve && !toastShown) {
            setToastShown(true);
            toast.show({
                description: 'Das Match wurde aufgelöst',
                placement: 'top',
            });
        }
    }, [_dissolve?.data?.matchDissolve, toast, toastShown]);

    const activeMatches = useMemo(() => {
        return data?.me?.pupil?.matches?.filter((match) => !match.dissolved);
    }, [data?.me?.pupil?.matches]);

    const getMeetingLink = useCallback(async () => {
        const subcourseId = highlightedAppointment?.subcourse.id;
        if (!subcourseId) return;

        const windowRef = window.open(undefined, '_blank');

        try {
            const res = await joinMeeting({ variables: { subcourseId } });

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
    }, [highlightedAppointment?.subcourse.id, joinMeeting]);

    const disableMeetingButton: boolean = useMemo(() => {
        if (!highlightedAppointment) return true;
        return DateTime.fromISO(highlightedAppointment?.lecture?.start).diffNow('minutes').minutes > 5;
    }, [highlightedAppointment]);

    return (
        <AsNavigationItem path="start">
            <WithNavigation
                headerContent={
                    !loading && (
                        <HStack
                            maxWidth={ContainerWidth}
                            space={space['1']}
                            alignItems="center"
                            bgColor={isMobile ? 'primary.900' : 'transparent'}
                            padding={isMobile ? space['1.5'] : space['0.5']}
                        >
                            <Hello />
                        </HStack>
                    )
                }
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                {!called || (loading && <CenterLoadingSpinner />)}
                {called && !loading && (
                    <VStack paddingX={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                        <ImportantInformation variant="dark" />
                        <VStack>
                            {highlightedAppointment && (
                                <VStack marginBottom={space['1.5']}>
                                    <Heading marginBottom={space['1']}>{t('dashboard.appointmentcard.header')}</Heading>

                                    <AppointmentCard
                                        videoButton={
                                            <VStack w="100%" space={space['0.5']}>
                                                <Tooltip isDisabled={!disableMeetingButton} maxWidth={300} label={t('course.meeting.hint.pupil')}>
                                                    <Button
                                                        width="100%"
                                                        marginTop={space['1']}
                                                        onPress={getMeetingLink}
                                                        isDisabled={disableMeetingButton || _joinMeeting.loading}
                                                    >
                                                        {t('course.meeting.videobutton.pupil')}
                                                    </Button>
                                                </Tooltip>
                                                {showMeetingNotStarted && <Text color="lightText">{t('course.meeting.videotext')}</Text>}
                                            </VStack>
                                        }
                                        isTeaser={true}
                                        onPressToCourse={() => {
                                            DateTime.now().plus({ days: 7 }).toISODate();
                                            trackEvent({
                                                category: 'dashboard',
                                                action: 'click-event',
                                                name: 'Schüler Dashboard – Termin Teaser | Klick auf' + sortedAppointments[0]?.subcourse.course?.name,
                                                documentTitle: 'Schüler Dashboard',
                                            });
                                            navigate(`/single-course/${sortedAppointments[0]?.subcourse.id}`);
                                        }}
                                        tags={highlightedAppointment?.subcourse?.course?.tags}
                                        date={highlightedAppointment?.lecture.start}
                                        duration={highlightedAppointment?.lecture.duration}
                                        image={highlightedAppointment?.subcourse.course?.image ?? undefined}
                                        title={highlightedAppointment?.subcourse.course?.name}
                                        description={'' /* highlightedAppointment?.subcourse.course?.description?.substring(0, 64) */}
                                    />
                                </VStack>
                            )}

                            {/* Appointments */}
                            <HSection marginBottom={space['1.5']} title={t('dashboard.myappointments.header')}>
                                {(sortedAppointments.length > 1 &&
                                    sortedAppointments.slice(1, 5).map(({ subcourse, lecture }) => {
                                        return (
                                            <AppointmentCard
                                                key={`${subcourse.course.description}+${lecture.start}`}
                                                description={subcourse.course.description}
                                                tags={subcourse.course.tags}
                                                date={lecture.start}
                                                image={subcourse.course.image ?? undefined}
                                                title={subcourse.course.name}
                                                countCourse={subcourse.lectures.length}
                                                maxParticipants={subcourse.maxParticipants}
                                                participantsCount={subcourse.participantsCount}
                                                minGrade={subcourse.minGrade}
                                                maxGrade={subcourse.maxGrade}
                                                statusText={getTrafficStatusText(subcourse)}
                                                isFullHeight
                                                isHorizontalCardCourseChecked={subcourse.isParticipant}
                                                showCourseTraffic
                                                showSchoolclass
                                                trafficLightStatus={getTrafficStatus(subcourse?.participantsCount || 0, subcourse?.maxParticipants || 0)}
                                                onPressToCourse={() => {
                                                    trackEvent({
                                                        category: 'dashboard',
                                                        action: 'click-event',
                                                        name: 'Schüler Dashboard – Meine Termin | Klick auf' + subcourse.course.name,
                                                        documentTitle: 'Schüler Dashboard',
                                                    });

                                                    navigate(`/single-course/${subcourse.id}`);
                                                }}
                                            />
                                        );
                                    })) || <AlertMessage content={t('dashboard.myappointments.noappointments')} />}
                            </HSection>

                            {/* Matches */}
                            {data?.myRoles?.includes('TUTEE') &&
                                ((activeMatches?.length ?? 0) > 0 ||
                                    (data?.me?.pupil?.canRequestMatch?.allowed && DEACTIVATE_PUPIL_MATCH_REQUESTS !== 'true') ||
                                    (data?.me?.pupil?.openMatchRequestCount ?? 0) > 0) && (
                                    <HSection
                                        marginBottom={space['1.5']}
                                        title={t('dashboard.learningpartner.header')}
                                        showAll={(activeMatches?.length ?? 0) > 2}
                                        wrap
                                    >
                                        <Flex direction="row" flexWrap="wrap" marginRight="-10px">
                                            {activeMatches!.map((match) => (
                                                <Box width={CardGrid} marginRight="10px" marginBottom="10px" key={match.id}>
                                                    <LearningPartner
                                                        matchId={match.id}
                                                        name={`${match?.student?.firstname} ${match?.student?.lastname}`}
                                                        subjects={match?.subjectsFormatted}
                                                    />
                                                </Box>
                                            ))}
                                        </Flex>
                                        {data?.me?.pupil?.canRequestMatch?.allowed && DEACTIVATE_PUPIL_MATCH_REQUESTS !== 'true' && (
                                            <Button
                                                width={ButtonContainer}
                                                onPress={() => {
                                                    trackEvent({
                                                        category: 'dashboard',
                                                        action: 'click-event',
                                                        name: 'Schüler Dashboard – Matching anfragen',
                                                        documentTitle: 'Schüler Dashboard',
                                                    });
                                                    navigate('/request-match');
                                                }}
                                            >
                                                {t('dashboard.helpers.buttons.requestMatchPupil')}
                                            </Button>
                                        )}
                                        {(data?.me?.pupil?.openMatchRequestCount ?? 0) > 0 && (
                                            <VStack space={2} flexShrink={1} maxWidth="700px">
                                                {data?.me?.pupil?.firstMatchRequest && (
                                                    <Text>
                                                        {t('dashboard.offers.requestCreated')}{' '}
                                                        {DateTime.fromISO(data?.me?.pupil?.firstMatchRequest).toFormat('dd.MM.yyyy, HH:mm')} {t('clock')}
                                                    </Text>
                                                )}
                                                <Alert maxWidth="520px" alignItems="start" marginY={space['0.5']} colorScheme="info">
                                                    <HStack space={2} flexShrink={1} alignItems="center">
                                                        <Alert.Icon color="danger.100" />
                                                        <Text>{t('dashboard.offers.waitingTimeInfo')}</Text>
                                                    </HStack>
                                                </Alert>

                                                <Button
                                                    width={ButtonContainer}
                                                    isDisabled={_cancelMatchRequest?.loading}
                                                    onPress={() => setShowCancelModal(true)}
                                                >
                                                    {t('dashboard.offers.removeRequest')}
                                                </Button>
                                            </VStack>
                                        )}
                                    </HSection>
                                )}

                            {/* Suggestions */}
                            <HSection
                                marginBottom={space['1.5']}
                                title={t('dashboard.relatedcontent.header')}
                                onShowAll={() => navigate('/group')}
                                showAll={(data?.subcoursesPublic?.length ?? 0) > 4}
                            >
                                {(data?.subcoursesPublic?.length &&
                                    data?.subcoursesPublic?.slice(0, 4).map((subcourse) => (
                                        <AppointmentCard
                                            key={subcourse.id}
                                            description={subcourse.course.description}
                                            tags={subcourse.course.tags}
                                            date={subcourse?.firstLecture?.start ?? undefined}
                                            image={subcourse.course.image ?? undefined}
                                            title={subcourse.course.name}
                                            countCourse={subcourse.lectures.length}
                                            maxParticipants={subcourse.maxParticipants}
                                            participantsCount={subcourse.participantsCount}
                                            minGrade={subcourse.minGrade}
                                            maxGrade={subcourse.maxGrade}
                                            isFullHeight
                                            showCourseTraffic
                                            showSchoolclass
                                            trafficLightStatus={getTrafficStatus(subcourse.participantsCount ?? 0, subcourse.maxParticipants ?? 0)}
                                            onPressToCourse={() => {
                                                trackEvent({
                                                    category: 'dashboard',
                                                    action: 'click-event',
                                                    name: 'Schüler Dashboard – Matching Vorschlag',
                                                    documentTitle: 'Schüler Dashboard',
                                                });

                                                navigate(`/single-course/${subcourse.id}`);
                                            }}
                                        />
                                    ))) || <AlertMessage content={t('dashboard.noproposalsPupil')} />}
                            </HSection>
                        </VStack>
                    </VStack>
                )}
            </WithNavigation>
            <DissolveMatchModal
                showDissolveModal={showDissolveModal}
                onPressDissolve={async (reason: string) => {
                    setShowDissolveModal(false);
                    return await dissolve({
                        variables: {
                            matchId: dissolveData!.id,
                            dissolveReason: parseInt(reason),
                        },
                    });
                }}
                onPressBack={() => setShowDissolveModal(false)}
            />
            <CancelMatchRequestModal
                showModal={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onShareFeedback={(feedback) => cancelMatchRequestReaction(true, feedback)}
                onSkipShareFeedback={() => cancelMatchRequestReaction(false)}
            />
        </AsNavigationItem>
    );
};
export default Dashboard;
