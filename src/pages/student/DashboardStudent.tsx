import { Text, Button, Heading, HStack, useTheme, VStack, useToast, useBreakpointValue, Box, Stack } from 'native-base';
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
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AsNavigationItem from '../../components/AsNavigationItem';
import DissolveMatchModal from '../../modals/DissolveMatchModal';
import Hello from '../../widgets/Hello';
import CSSWrapper from '../../components/CSSWrapper';
import AlertMessage from '../../widgets/AlertMessage';
import ImportantInformation from '../../widgets/ImportantInformation';
import RecommendModal from '../../modals/RecommendModal';
import { gql } from './../../gql';
import HelpNavigation from '../../components/HelpNavigation';
import NextAppointmentCard from '../../widgets/NextAppointmentCard';
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
                subcoursesInstructing(excludePast: true) {
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
                    firstLecture { start duration }
                    nextLecture { start duration }
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
            id
            minGrade
            maxGrade
            participantsCount
            maxParticipants
            course {
                name
                description
                courseState
                tags {
                    name
                }
                image
            }
            lectures {
                start
                duration
            }
            firstLecture { start duration }
            nextLecture { start duration }
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

    const activeMatches = useMemo(() => data?.me?.student?.matches.filter((match) => !match.dissolved), [data?.me?.student?.matches]);

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
                        <VStack>
                            <VStack marginBottom={space['1.5']}>
                                <ImportantInformation variant="normal" />
                            </VStack>
                            {/* Next Appointment */}

                            <VStack marginBottom={space['1.5']}>
                                <VStack space={space['1']}>
                                    <NextAppointmentCard appointments={data?.me?.appointments as Lecture[]} />
                                </VStack>
                            </VStack>

                            {data?.me?.student?.canCreateCourse?.allowed && (
                                <HSection
                                    title={t('dashboard.helpers.headlines.course')}
                                    showAll
                                    onShowAll={() => navigate('/group')}
                                    wrap
                                    marginBottom={space['1.5']}
                                    scrollable={false}
                                >
                                    <CSSWrapper className="course-list__wrapper">
                                        {data?.me?.student?.subcoursesInstructing.length > 0 ? (
                                            data?.me?.student?.subcoursesInstructing
                                                .filter((subcourse) => subcourse.published)
                                                .slice(0, 4)
                                                .map((subcourse) => {
                                                    return (
                                                        <AppointmentCard
                                                            key={subcourse.id}
                                                            description={subcourse.course.description}
                                                            tags={subcourse.course.tags}
                                                            dateFirstLecture={subcourse?.firstLecture?.start ?? undefined}
                                                            dateNextLecture={subcourse?.nextLecture?.start ?? undefined}
                                                            image={subcourse.course.image ?? undefined}
                                                            title={subcourse.course.name}
                                                            countCourse={subcourse.lectures.length}
                                                            maxParticipants={subcourse.maxParticipants}
                                                            participantsCount={subcourse.participantsCount}
                                                            minGrade={subcourse.minGrade}
                                                            statusText={getTrafficStatusText(subcourse)}
                                                            showCourseTraffic
                                                            showSchoolclass
                                                            showStatus
                                                            trafficLightStatus={getTrafficStatus(
                                                                subcourse.participantsCount ?? 0,
                                                                subcourse.maxParticipants ?? 0
                                                            )}
                                                            onPressToCourse={() => {
                                                                trackEvent({
                                                                    category: 'dashboard',
                                                                    action: 'click-event',
                                                                    name: 'Helfer Dashboard Kachelklick  ' + subcourse.course.name,
                                                                    documentTitle: 'Helfer Dashboard – Meine Kurse  ' + subcourse.course.name,
                                                                });

                                                                navigate(`/single-course/${subcourse.id}`);
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
