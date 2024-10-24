import { Text, Button, Heading, useTheme, VStack, useBreakpointValue, Box, Stack, Row } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';
import CTACard from '../../widgets/CTACard';
import BarrierIcon from '../../assets/icons/barrier-block_green.svg';
import WithNavigation from '../../components/WithNavigation';
import { useNavigate } from 'react-router-dom';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import BooksIcon from '../../assets/icons/lernfair/lf-books.svg';
import LearningPartner from '../../widgets/LearningPartner';
import { DateTime } from 'luxon';
import { getGradeLabel, getTrafficStatus, getTrafficStatusText } from '../../Utility';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AsNavigationItem from '../../components/AsNavigationItem';
import CSSWrapper from '../../components/CSSWrapper';
import AlertMessage from '../../widgets/AlertMessage';
import ImportantInformation from '../../widgets/ImportantInformation';
import RecommendModal from '../../modals/RecommendModal';
import { gql } from './../../gql';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import NextAppointmentCard from '../../widgets/NextAppointmentCard';
import { Lecture } from '../../gql/graphql';
import useApollo from '../../hooks/useApollo';
import { useUserType } from '../../hooks/useApollo';
import { Typography } from '@/components/Typography';

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
                        gradeAsInt
                        subjectsFormatted {
                            name
                        }
                        schooltype
                    }
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
                    nextLecture {
                        start
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
            appointments(take: 10, skip: 0) {
                id
                title
                description
                start
                duration
                appointmentType
                total
                position
                displayName
                isOrganizer
                isParticipant
                organizers(skip: 0, take: 5) {
                    id
                    userID
                    firstname
                    lastname
                }
                participants(skip: 0, take: 30) {
                    id
                    userID
                    firstname
                    lastname
                }
                declinedBy
                zoomMeetingId
                subcourse {
                    published
                    course {
                        image
                        subject
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
    const { roles } = useApollo();
    const { data, loading, called } = useQuery(query);

    const { space, sizes } = useTheme();
    const userType = useUserType();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showRecommendModal, setShowRecommendModal] = useState<boolean>(false);
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

    const requestMatch = useCallback(async () => {
        navigate('/request-match');
    }, [navigate]);

    const isMobile = useBreakpointValue({ base: true, md: false });
    const isMobileOrTablet = useBreakpointValue({ base: true, lg: false });
    const startSummerVacation = new Date('2024-06-10');
    const endSummerVacation = new Date('2024-09-02');
    const isSummerVacation = startSummerVacation <= new Date() && endSummerVacation >= new Date();

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
            const aLecture = a.nextLecture;
            const bLecture = b.nextLecture;

            if (bLecture === null) return -1;
            if (aLecture === null) return 1;

            if (!aLecture || !bLecture) return 0;

            const aDate = DateTime.fromISO(aLecture.start).toMillis();
            const bDate = DateTime.fromISO(bLecture.start).toMillis();

            if (aDate < DateTime.now().toMillis()) return 1;
            if (bDate < DateTime.now().toMillis()) return 1;

            if (aDate === bDate) return 0;
            return aDate > bDate ? 1 : -1;
        });

        return courses;
    }, [publishedSubcourses]);

    const activeMatches = useMemo(() => data?.me?.student?.matches.filter((match) => !match.dissolved), [data?.me?.student?.matches]);

    const handleOnRecommendClick = () => {
        setShowRecommendModal(true);
        trackEvent({
            category: 'Recommend Section on Start Page',
            action: 'Click Button “Recommend Now”',
            name: 'huh',
        });
    };

    return (
        <AsNavigationItem path="start">
            <WithNavigation
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </Stack>
                }
            >
                {!called || (loading && <CenterLoadingSpinner />)}
                {called && !loading && (
                    <VStack paddingX={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                        <div>
                            <Typography variant="h3" as="p">
                                {t('hallo')} {data?.me.firstname}&nbsp;&nbsp;👋
                            </Typography>
                        </div>
                        <VStack>
                            <VStack marginBottom={space['1.5']}>
                                <ImportantInformation variant="normal" />
                            </VStack>
                            {/* Next Appointment */}
                            <VStack marginBottom={space['1.5']}>
                                <VStack space={space['1']}>
                                    <NextAppointmentCard appointments={data?.me?.appointments as Lecture[]} />

                                    {(isSummerVacation || process.env.REACT_APP_HOMEWORKHELP !== '') && userType === 'student' && (
                                        <VStack marginBottom={space['1.5']}>
                                            <Heading marginBottom={space['1']}>{t('dashboard.homeworkhelp.title')}</Heading>
                                            <CTACard
                                                title={t('dashboard.homeworkhelp.catcherHelper')}
                                                closeable={false}
                                                content={<Text>{t('matching.homeworkhelp.texthelper')}</Text>}
                                                buttonIsBanner={isSummerVacation}
                                                button={
                                                    isSummerVacation ? (
                                                        <Row
                                                            width="100%"
                                                            flexWrap="wrap"
                                                            justifyContent={'flex-start'}
                                                            alignItems={'center'}
                                                            bg={'secondary.100'}
                                                            borderRadius={4}
                                                            padding={2}
                                                        >
                                                            <Box mr={space['0.5']}>
                                                                <BarrierIcon />
                                                            </Box>
                                                            <Text fontSize={'sm'} flexWrap={'wrap'}>
                                                                {t('matching.homeworkhelp.buttonSummerVacation', {
                                                                    endSummerVacation: endSummerVacation.toLocaleDateString('de-DE'),
                                                                })}
                                                            </Text>
                                                        </Row>
                                                    ) : (
                                                        <Button onPress={() => window.open(process.env.REACT_APP_HOMEWORKHELP, '_blank')}>
                                                            {t('matching.homeworkhelp.button')}
                                                        </Button>
                                                    )
                                                }
                                                icon={<BooksIcon />}
                                            />
                                        </VStack>
                                    )}
                                </VStack>
                            </VStack>

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
                                                if (!sub.nextLecture) return <></>;
                                                return (
                                                    <AppointmentCard
                                                        key={index}
                                                        subcourseId={sub.id}
                                                        description={sub.course.description}
                                                        tags={sub.course.tags}
                                                        dateNextLecture={sub?.nextLecture?.start ?? undefined}
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
                                    {roles.includes('INSTRUCTOR') && data?.me?.student?.canCreateCourse?.allowed ? (
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
                                    <Stack direction={isMobileOrTablet ? 'column' : 'row'} flexWrap="wrap">
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
                                                            grade={getGradeLabel(match?.pupil?.gradeAsInt) || ''}
                                                        />
                                                    </Box>
                                                );
                                            })) ||
                                            (data?.me?.student?.canRequestMatch?.allowed ? <AlertMessage content={t('dashboard.offers.noMatching')} /> : '')}
                                    </Stack>

                                    {data?.me?.student?.canRequestMatch?.allowed ? (
                                        <Button marginTop={space['1']} width={ButtonContainer} marginY={space['1']} onPress={requestMatch}>
                                            {t('dashboard.helpers.buttons.requestMatchStudent')}
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
                                        <Button variant="outline" onPress={handleOnRecommendClick}>
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
            <RecommendModal isOpen={showRecommendModal} onOpenChange={setShowRecommendModal} />
        </AsNavigationItem>
    );
};
export default DashboardStudent;
