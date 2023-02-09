import { Text, Button, Heading, HStack, useTheme, VStack, useToast, useBreakpointValue, Column, Box, Tooltip } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';
import CTACard from '../../widgets/CTACard';
import WithNavigation from '../../components/WithNavigation';
import { useNavigate } from 'react-router-dom';
import NotificationAlert from '../../components/NotificationAlert';
import { useTranslation } from 'react-i18next';
import { gql, useMutation, useQuery } from '@apollo/client';
import BooksIcon from '../../assets/icons/lernfair/lf-books.svg';
import LearningPartner from '../../widgets/LearningPartner';
import { LFMatch } from '../../types/lernfair/Match';
import { LFLecture, LFSubCourse } from '../../types/lernfair/Course';
import { DateTime } from 'luxon';
import { getFirstLectureFromSubcourse, getTrafficStatus } from '../../Utility';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AsNavigationItem from '../../components/AsNavigationItem';
import DissolveMatchModal from '../../modals/DissolveMatchModal';
import Hello from '../../widgets/Hello';
import CSSWrapper from '../../components/CSSWrapper';
import AlertMessage from '../../widgets/AlertMessage';
import { log } from '../../log';
import ImportantInformation from '../../widgets/ImportantInformation';

type Props = {};

const query = gql`
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
                        grade
                        subjectsFormatted {
                            name
                        }
                    }
                    pupilEmail
                }
                subcoursesInstructing {
                    id
                    participantsCount
                    maxParticipants
                    published
                    lectures {
                        start
                        duration
                    }
                    course {
                        name
                        description
                        tags {
                            name
                        }
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
            }
        }
    }
`;

const DashboardStudent: React.FC<Props> = () => {
    const toast = useToast();
    const { data, loading, called } = useQuery(query);

    const { space, sizes } = useTheme();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [toastShown, setToastShown] = useState<boolean>();

    const [showDissolveModal, setShowDissolveModal] = useState<boolean>();
    const [dissolveData, setDissolveData] = useState<LFMatch>();

    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Dashboard',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [dissolve, _dissolve] = useMutation(
        gql`
            mutation dissolveMatchStudent($matchId: Float!, $dissolveReason: Float!) {
                matchDissolve(dissolveReason: $dissolveReason, matchId: $matchId)
            }
        `,
        {
            refetchQueries: [query],
        }
    );

    const [joinMeeting, _joinMeeting] = useMutation(gql`
        mutation joinMeetingStudent($subcourseId: Float!) {
            subcourseJoinMeeting(subcourseId: $subcourseId)
        }
    `);

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
        () => data?.me?.student?.subcoursesInstructing.filter((sub: LFSubCourse) => sub.published),
        [data?.me?.student?.subcoursesInstructing]
    );

    const sortedPublishedSubcourses = useMemo(() => {
        if (!publishedSubcourses) return [];

        const courses = [...publishedSubcourses];

        courses.sort((a: LFSubCourse, b: LFSubCourse) => {
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

    const sortedAppointments: { subcourse: LFSubCourse; lecture: LFLecture }[] = useMemo(() => {
        const lectures: { subcourse: LFSubCourse; lecture: LFLecture }[] = [];
        if (!publishedSubcourses) return [];

        for (const subcourse of publishedSubcourses) {
            const futureAndOngoingLectures = subcourse.lectures.filter(
                (lecture: LFLecture) => DateTime.now().toMillis() < DateTime.fromISO(lecture.start).toMillis() + 1000 * 60 * lecture.duration
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
    }, [publishedSubcourses]);

    const highlightedAppointment = sortedAppointments[0];

    const activeMatches = useMemo(() => data?.me?.student?.matches.filter((match: LFMatch) => !match.dissolved), [data?.me?.student?.matches]);

    const getMeetingLink = useCallback(async () => {
        const subcourseId = highlightedAppointment?.subcourse.id;
        if (!subcourseId) return;

        try {
            const res = await joinMeeting({ variables: { subcourseId } });
            window.open(res.data.subcourseJoinMeeting, '_blank');
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
                                        image={highlightedAppointment.subcourse.course?.image}
                                        title={highlightedAppointment.subcourse.course?.name || ''}
                                        description={highlightedAppointment.subcourse.course?.description || ''}
                                    />
                                </VStack>
                            )}
                            {sortedAppointments.length > 1 && (
                                <HSection title={t('dashboard.myappointments.header')} marginBottom={space['1.5']}>
                                    {sortedAppointments.slice(1, 5).map(({ lecture, subcourse }, index) => {
                                        const { course } = subcourse;

                                        return (
                                            <Column minWidth="230px" maxWidth="300px" flex={1} h="100%">
                                                <AppointmentCard
                                                    isGrid
                                                    isFullHeight
                                                    onPressToCourse={() => {
                                                        trackEvent({
                                                            category: 'dashboard',
                                                            action: 'click-event',
                                                            name: 'Helfer Dashboard Kachelklick  ' + course.name,
                                                            documentTitle: 'Helfer Dashboard – Meine Termin  ' + course.name,
                                                        });

                                                        navigate(`/single-course/${subcourse.id}`);
                                                    }}
                                                    key={`appointment-${index}`}
                                                    description={course.description}
                                                    tags={course.tags}
                                                    date={lecture.start}
                                                    image={course.image}
                                                    title={course.name}
                                                />
                                            </Column>
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
                                            sortedPublishedSubcourses.slice(0, 4).map((sub: LFSubCourse, index: number) => {
                                                const firstLecture = getFirstLectureFromSubcourse(sub.lectures);
                                                if (!firstLecture) return <></>;
                                                return (
                                                    <CSSWrapper className="course-list__item">
                                                        <AppointmentCard
                                                            isFullHeight
                                                            isSpaceMarginBottom={false}
                                                            variant="horizontal"
                                                            key={index}
                                                            description={sub.course.description}
                                                            tags={sub.course.tags}
                                                            date={firstLecture.start}
                                                            countCourse={sub.lectures.length}
                                                            showTrafficLight
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
                                                            image={sub.course.image}
                                                            title={sub.course.name}
                                                        />
                                                    </CSSWrapper>
                                                );
                                            })
                                        ) : (
                                            <AlertMessage content={t('empty.courses')} />
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
                                                `lernfair.reason.${data?.me?.student?.canCreateCourse?.reason}.course` as unknown as TemplateStringsArray
                                            )}
                                        />
                                    )}
                                </HSection>
                            )}
                            {(activeMatches.length > 0 || data?.me?.student?.canRequestMatch?.allowed) && (
                                <VStack marginBottom={space['1.5']}>
                                    <Heading>{t('dashboard.helpers.headlines.myLearningPartner')}</Heading>
                                    <Text marginTop={space['0.5']} marginBottom={space['1']}>
                                        {t('dashboard.helpers.headlines.openedRequests')} {`${data?.me?.student?.openMatchRequestCount}`}
                                    </Text>
                                    <CSSWrapper className="course-list__wrapper">
                                        {(activeMatches?.length &&
                                            activeMatches.map((match: LFMatch, index: number) => (
                                                <CSSWrapper className="course-list__item">
                                                    <LearningPartner
                                                        key={index}
                                                        isDark={true}
                                                        name={match?.pupil?.firstname}
                                                        subjects={match?.pupil?.subjectsFormatted}
                                                        schooltype={match?.pupil?.schooltype || ''}
                                                        schoolclass={match?.pupil?.grade}
                                                        button={
                                                            (!match.dissolved && (
                                                                <Button variant="outlinelight" onPress={() => dissolveMatch(match)}>
                                                                    {t('matching.request.buttons.dissolve')}
                                                                </Button>
                                                            )) || <Text color="lightText">{t('matching.status.dissolved')}</Text>
                                                        }
                                                        contactMail={match?.pupilEmail}
                                                        meetingId={match?.uuid}
                                                    />
                                                </CSSWrapper>
                                            ))) ||
                                            (data?.me?.student?.canRequestMatch?.allowed ? <AlertMessage content={t('empty.matchings')} /> : '')}
                                    </CSSWrapper>

                                    {data?.me?.student?.canRequestMatch?.allowed ? (
                                        <Button
                                            marginTop={space['1']}
                                            width={ButtonContainer}
                                            isDisabled={_dissolve.loading}
                                            marginY={space['1']}
                                            onPress={requestMatch}
                                        >
                                            {t('dashboard.helpers.buttons.requestMatch')}
                                        </Button>
                                    ) : (
                                        <AlertMessage
                                            content={t(
                                                `lernfair.reason.${data?.me?.student?.canRequestMatch?.reason}.matching` as unknown as TemplateStringsArray
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
                                        <Button
                                            variant="outline"
                                            onPress={() =>
                                                window.open(
                                                    'https://wa.me/?text=Hast%20du%20schon%20von%20Lern-Fair%20geh%C3%B6rt%3F%20Dort%20kannst%20du%20dich%20von%20zuhause%20aus%20f%C3%BCr%20bildungsbenachteiligte%20Sch%C3%BCler%3Ainnen%20in%20ganz%20Deutschland%20engagieren.%0AAlles%20was%20du%20daf%C3%BCr%20brauchst%2C%20sind%201-2%20Stunden%20pro%20Woche%20und%20Spa%C3%9F%20an%20der%20Vermittlung%20von%20Unterrichtsinhalten.%20Am%20Ende%20erh%C3%A4ltst%20du%20sogar%20eine%20Bescheinigung!%20%0ARegistriere%20dich%20unter%20www.lern-fair.de%20und%20setze%20dich%20f%C3%BCr%20gleiche%20Bildungschancen%20in%20Deutschland%20ein%20%3C3'
                                                )
                                            }
                                        >
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
                            matchId: dissolveData?.id,
                            dissolveReason: parseInt(reason),
                        },
                    });
                }}
                onPressBack={() => setShowDissolveModal(false)}
            />
        </AsNavigationItem>
    );
};
export default DashboardStudent;
