import { Text, Button, Heading, HStack, useTheme, VStack, useToast, useBreakpointValue, Box, Tooltip, Stack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';
import CTACard from '../../widgets/CTACard';
import WithNavigation from '../../components/WithNavigation';
import { useNavigate } from 'react-router-dom';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import BooksIcon from '../../assets/icons/lernfair/lf-books.svg';
import LearningPartner from '../../widgets/LearningPartner';
import { LFMatch } from '../../types/lernfair/Match';
import { DateTime } from 'luxon';
import { getFirstLectureFromSubcourse, getTrafficStatus, getTrafficStatusText } from '../../Utility';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AsNavigationItem from '../../components/AsNavigationItem';
import DissolveMatchModal from '../../modals/DissolveMatchModal';
import Hello from '../../widgets/Hello';
import CSSWrapper from '../../components/CSSWrapper';
import AlertMessage from '../../widgets/AlertMessage';
import { log } from '../../log';
import ImportantInformation from '../../widgets/ImportantInformation';
import RecommendModal from '../../modals/RecommendModal';
import { gql } from './../../gql';
import {} from '../../gql/gql';
import { Lecture } from '../../gql/graphql';

type Props = {};

const query = gql(`
    query StudentDashboard {
        me {
            firstname
            student {
                firstMatchRequest
                openMatchRequestCount
                canRequestMatch {
                    allowed
                    reason
                }
                canCreateCourse {
                    allowed
                    reason
                }
                matches {
                    id
                    uuid
                    dissolved
                    pupil {
                        firstname
                        lastname
                        grade
                        subjectsFormatted {
                            name
                        }
                        schooltype
                    }
                    pupilEmail
                }
                subcoursesInstructing {
                    id
                    minGrade
                    maxGrade
                    participantsCount
                    maxParticipants
                    published
                    cancelled
                    lectures {
                        start
                        duration
                    }
                    course {
                        name
                        description
                        courseState
                        tags {
                            name
                        }
                        image
                    }
                }
            }
        }

        subcoursesPublic(take: 10, skip: 2) {
            participantsCount
            maxParticipants
            course {
                name
                description
                tags {
                    name
                }
                image
            }
        }
    }
`);

const DashboardStudent: React.FC<Props> = () => {
    const toast = useToast();
    const { data, loading, called } = useQuery(query);

    const { space, sizes } = useTheme();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [toastShown, setToastShown] = useState<boolean>();
    const [showDissolveModal, setShowDissolveModal] = useState<boolean>();
    const [showRecommendModal, setShowRecommendModal] = useState<boolean>(false);
    const [dissolveData, setDissolveData] = useState<LFMatch>();

    const { trackPageView, trackEvent } = useMatomo();

    const CardGrid = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Dashboard',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [dissolve, _dissolve] = useMutation(
        gql(`
            mutation dissolveMatchStudent($matchId: Float!, $dissolveReason: Float!) {
                matchDissolve(dissolveReason: $dissolveReason, matchId: $matchId)
            }
        `),
        {
            refetchQueries: [query],
        }
    );

    const [joinMeeting, _joinMeeting] = useMutation(
        gql(`
        mutation joinMeetingStudent($subcourseId: Float!) {
            subcourseJoinMeeting(subcourseId: $subcourseId)
        }
    `)
    );

    const requestMatch = useCallback(async () => {
        navigate('/request-match');
    }, [navigate]);

    const dissolveMatch = useCallback((match: LFMatch) => {
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

    const isMobile = useBreakpointValue({ base: true, lg: false });

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const publishedSubcourses = useMemo(
        () => data?.me?.student?.subcoursesInstructing.filter((sub) => sub.published),
        [data?.me?.student?.subcoursesInstructing]
    );

    const sortedPublishedSubcourses = useMemo(() => {
        if (!publishedSubcourses) return [];

        const courses = [...publishedSubcourses];

        courses.sort((a, b) => {
            const aLecture = getFirstLectureFromSubcourse(a.lectures);
            const bLecture = getFirstLectureFromSubcourse(b.lectures);

            if (bLecture === null) return -1;
            if (aLecture === null) return 1;

            const aDate = DateTime.fromISO(aLecture.start).toMillis();
            const bDate = DateTime.fromISO(bLecture.start).toMillis();

            if (aDate < DateTime.now().toMillis()) return 1;
            if (bDate < DateTime.now().toMillis()) return 1;

            if (aDate === bDate) return 0;
            return aDate > bDate ? 1 : -1;
        });

        return courses;
    }, [publishedSubcourses]);

    const sortedAppointments = useMemo(() => {
        if (!publishedSubcourses) return [];
        const lectures: { subcourse: typeof publishedSubcourses[number]; lecture: Pick<Lecture, 'start' | 'duration'> }[] = [];

        for (const subcourse of publishedSubcourses) {
            const futureAndOngoingLectures = subcourse.lectures.filter(
                (lecture) => DateTime.now().toMillis() < DateTime.fromISO(lecture.start).toMillis() + 1000 * 60 * lecture.duration
            );

            for (const lecture of futureAndOngoingLectures) {
                lectures.push({ subcourse, lecture });
            }
        }

        return lectures.sort((a, b) => {
            const _a = DateTime.fromISO(a.lecture.start).toMillis();
            const _b = DateTime.fromISO(b.lecture.start).toMillis();

            return _a - _b;
        });
    }, [publishedSubcourses]);

    const highlightedAppointment = sortedAppointments[0];

    const activeMatches = useMemo(() => data?.me?.student?.matches.filter((match) => !match.dissolved), [data?.me?.student?.matches]);

    const getMeetingLink = useCallback(async () => {
        const subcourseId = highlightedAppointment?.subcourse.id;
        if (!subcourseId) return;

        const windowRef = window.open(undefined, '_blank');

        try {
            const res = await joinMeeting({ variables: { subcourseId } });
            if (windowRef) windowRef.location = res.data!.subcourseJoinMeeting;
        } catch (e) {
            log('DashboardStudent', `Student failed to join Meeting: ${(e as Error)?.message}`, e);
        }
    }, [highlightedAppointment?.subcourse.id, joinMeeting]);

    const disableMeetingButton: boolean = useMemo(() => {
        if (!highlightedAppointment) return true;
        return DateTime.fromISO(highlightedAppointment.lecture.start).diffNow('minutes').minutes > 60;
    }, [highlightedAppointment]);

    return (
        <AsNavigationItem path="start">
            <WithNavigation
                headerContent={
                    called &&
                    !loading && (
                        <HStack space={space['1']} alignItems="center" bgColor={isMobile ? 'primary.900' : 'transparent'} paddingX={space['1']}>
                            <Box paddingY={space['1.5']}>
                                <Hello />
                            </Box>
                        </HStack>
                    )
                }
                headerLeft={<NotificationAlert />}
            >
                {!called || (loading && <CenterLoadingSpinner />)}
                {called && !loading && (
                    <VStack paddingX={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                        <VStack>
                            <VStack marginBottom={space['1.5']}>
                                <ImportantInformation variant="normal" />
                            </VStack>
                            {/* Next Appointment */}
                            {highlightedAppointment && (
                                <VStack marginBottom={space['1.5']}>
                                    <Heading marginBottom={space['1']}>{t('dashboard.appointmentcard.header')}</Heading>

                                    <AppointmentCard
                                        videoButton={
                                            <VStack w="100%" space={space['0.5']}>
                                                <Tooltip isDisabled={!disableMeetingButton} maxWidth={300} label={t('course.meeting.hint.student')}>
                                                    <Button
                                                        width="100%"
                                                        marginTop={space['1']}
                                                        onPress={() => {
                                                            getMeetingLink();
                                                        }}
                                                        isDisabled={disableMeetingButton}
                                                    >
                                                        {t('course.meeting.videobutton.student')}
                                                    </Button>
                                                </Tooltip>
                                            </VStack>
                                        }
                                        onPressToCourse={() => {
                                            trackEvent({
                                                category: 'dashboard',
                                                action: 'click-event',
                                                name: 'Helfer Dashboard Kachelklick   ' + highlightedAppointment.subcourse.course?.name || '',
                                                documentTitle: 'Helfer Dashboard – Nächster Termin ' + highlightedAppointment.subcourse.course?.name || '',
                                            });
                                            navigate(`/single-course/${highlightedAppointment.subcourse.id}`);
                                        }}
                                        tags={highlightedAppointment.subcourse.course?.tags}
                                        date={highlightedAppointment.lecture.start || ''}
                                        duration={highlightedAppointment.lecture.duration}
                                        isTeaser={true}
                                        image={highlightedAppointment?.subcourse?.course?.image || ''}
                                        title={highlightedAppointment.subcourse.course?.name || ''}
                                        description={highlightedAppointment.subcourse.course?.description || ''}
                                    />
                                </VStack>
                            )}
                            {sortedAppointments.length > 1 && (
                                <HSection title={t('dashboard.myappointments.header')} marginBottom={space['1.5']}>
                                    {sortedAppointments.slice(1, 5).map(({ lecture, subcourse }) => {
                                        const { course } = subcourse;

                                        return (
                                            <AppointmentCard
                                                key={subcourse.id}
                                                description={course.description}
                                                tags={course.tags}
                                                date={lecture.start}
                                                image={course?.image || ''}
                                                title={course.name}
                                                countCourse={subcourse.lectures.length}
                                                maxParticipants={subcourse.maxParticipants}
                                                participantsCount={subcourse.participantsCount}
                                                minGrade={subcourse.minGrade}
                                                maxGrade={subcourse.maxGrade}
                                                statusText={getTrafficStatusText(subcourse)}
                                                isFullHeight
                                                showSchoolclass
                                                showCourseTraffic
                                                showStatus
                                                trafficLightStatus={getTrafficStatus(subcourse?.participantsCount || 0, subcourse?.maxParticipants || 0)}
                                                onPressToCourse={() => {
                                                    trackEvent({
                                                        category: 'dashboard',
                                                        action: 'click-event',
                                                        name: 'Helfer Dashboard Kachelklick  ' + course.name,
                                                        documentTitle: 'Helfer Dashboard – Meine Termin  ' + course.name,
                                                    });

                                                    navigate(`/single-course/${subcourse.id}`);
                                                }}
                                            />
                                        );
                                    })}
                                </HSection>
                            )}
                            {(data?.me?.student?.canCreateCourse?.allowed || sortedPublishedSubcourses.length > 0) && (
                                <HSection
                                    title={t('dashboard.helpers.headlines.course')}
                                    showAll
                                    onShowAll={() => navigate('/group')}
                                    wrap
                                    marginBottom={space['1.5']}
                                    scrollable={false}
                                >
                                    <CSSWrapper className="course-list__wrapper">
                                        {sortedPublishedSubcourses.length > 0 ? (
                                            sortedPublishedSubcourses.slice(0, 4).map((sub, index) => {
                                                const firstLecture = getFirstLectureFromSubcourse(sub.lectures);
                                                if (!firstLecture) return <></>;
                                                return (
                                                    <AppointmentCard
                                                        key={index}
                                                        description={sub.course.description}
                                                        tags={sub.course.tags}
                                                        date={firstLecture.start}
                                                        image={sub.course.image || ''}
                                                        title={sub.course.name}
                                                        countCourse={sub.lectures.length}
                                                        maxParticipants={sub.maxParticipants}
                                                        participantsCount={sub.participantsCount}
                                                        minGrade={sub.minGrade}
                                                        maxGrade={sub.maxGrade}
                                                        statusText={getTrafficStatusText(sub)}
                                                        showCourseTraffic
                                                        showSchoolclass
                                                        showStatus
                                                        trafficLightStatus={getTrafficStatus(sub?.participantsCount || 0, sub?.maxParticipants || 0)}
                                                        onPressToCourse={() => {
                                                            trackEvent({
                                                                category: 'dashboard',
                                                                action: 'click-event',
                                                                name: 'Helfer Dashboard Kachelklick  ' + sub.course.name,
                                                                documentTitle: 'Helfer Dashboard – Meine Kurse  ' + sub.course.name,
                                                            });

                                                            navigate(`/single-course/${sub.id}`);
                                                        }}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <AlertMessage content={t('course.empty.nocourses')} />
                                        )}
                                    </CSSWrapper>
                                    {data?.me?.student?.canCreateCourse?.allowed ? (
                                        <Button
                                            marginTop={space['1']}
                                            width={ButtonContainer}
                                            onPress={() => {
                                                trackEvent({
                                                    category: 'dashboard',
                                                    action: 'click-event',
                                                    name: 'Helfer Dashboard Kurse-Erstellen Button',
                                                    documentTitle: 'Helfer Dashboard – Kurs Button klick',
                                                });
                                                navigate('/create-course');
                                            }}
                                        >
                                            {t('dashboard.helpers.buttons.course')}
                                        </Button>
                                    ) : (
                                        <AlertMessage
                                            content={t(
                                                `lernfair.reason.course.instructor.${data?.me?.student?.canCreateCourse?.reason}` as unknown as TemplateStringsArray
                                            )}
                                        />
                                    )}
                                </HSection>
                            )}
                            {activeMatches && (activeMatches.length > 0 || data?.me?.student?.canRequestMatch?.allowed) && (
                                <VStack marginBottom={space['1.5']}>
                                    <Heading mb={space['1']}>{t('dashboard.helpers.headlines.myLearningPartner')}</Heading>
                                    <Stack direction={isMobile ? 'column' : 'row'} flexWrap="wrap">
                                        {(activeMatches?.length &&
                                            activeMatches.map((match, index) => {
                                                return (
                                                    <Box width={CardGrid} paddingRight="10px" marginBottom="10px" key={match.id}>
                                                        <LearningPartner
                                                            key={index}
                                                            matchId={match.id}
                                                            name={`${match?.pupil?.firstname} ${match?.pupil?.lastname}` || ''}
                                                            subjects={match?.pupil?.subjectsFormatted}
                                                            schooltype={match?.pupil?.schooltype || ''}
                                                            grade={match?.pupil?.grade || ''}
                                                        />
                                                    </Box>
                                                );
                                            })) ||
                                            (data?.me?.student?.canRequestMatch?.allowed ? <AlertMessage content={t('dashboard.offers.noMatching')} /> : '')}
                                    </Stack>

                                    {data?.me?.student?.canRequestMatch?.allowed ? (
                                        <Button
                                            marginTop={space['1']}
                                            width={ButtonContainer}
                                            isDisabled={_dissolve.loading}
                                            marginY={space['1']}
                                            onPress={requestMatch}
                                        >
                                            {t('dashboard.helpers.buttons.requestMatchHuH')}
                                        </Button>
                                    ) : (
                                        <AlertMessage
                                            content={t(
                                                `lernfair.reason.matching.tutor.${data?.me?.student?.canRequestMatch?.reason}` as unknown as TemplateStringsArray
                                            )}
                                        />
                                    )}
                                </VStack>
                            )}
                            <VStack marginBottom={space['1.5']}>
                                <Heading marginBottom={space['1']}>{t('dashboard.helpers.headlines.recommend')}</Heading>
                                <CTACard
                                    title={t('dashboard.helpers.headlines.recommendFriends')}
                                    closeable={false}
                                    content={<Text>{t('dashboard.helpers.contents.recommendFriends')}</Text>}
                                    button={
                                        <Button variant="outline" onPress={() => setShowRecommendModal(true)}>
                                            {t('dashboard.helpers.buttons.recommend')}
                                        </Button>
                                    }
                                    icon={<BooksIcon />}
                                />
                            </VStack>
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
                            matchId: dissolveData?.id || 0,
                            dissolveReason: parseInt(reason),
                        },
                    });
                }}
                onPressBack={() => setShowDissolveModal(false)}
            />
            <RecommendModal showRecommendModal={showRecommendModal} onClose={() => setShowRecommendModal(false)} />
        </AsNavigationItem>
    );
};
export default DashboardStudent;
