import { Text, Button, HStack, useTheme, VStack, useBreakpointValue, Flex, Alert, Box, Stack, Heading } from 'native-base';
import { Button as NewButton } from '@/components/Button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';
import WithNavigation from '../../components/WithNavigation';
import { useNavigate } from 'react-router-dom';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { DEACTIVATE_PUPIL_MATCH_REQUESTS } from '../../config';
import { DateTime } from 'luxon';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AsNavigationItem from '../../components/AsNavigationItem';
import { getTrafficStatus } from '../../Utility';
import LearningPartner from '../../widgets/LearningPartner';
import ImportantInformation from '../../widgets/ImportantInformation';
import { gql } from '../../gql';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import NextAppointmentCard from '../../widgets/NextAppointmentCard';
import { Lecture } from '../../gql/graphql';
import DisableableButton from '../../components/DisablebleButton';
import { useRoles } from '../../hooks/useApollo';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { Typography } from '@/components/Typography';
import CTACard from '@/widgets/CTACard';
import BooksIcon from '../../assets/icons/lernfair/lf-books.svg';
import TruncatedText from '@/components/TruncatedText';

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
                    }
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
            nextLecture { start duration }
        }

        myRoles
    }
`);

const Dashboard: React.FC<Props> = () => {
    const { data, loading, called } = useQuery(query);
    const roles = useRoles();

    const { space, sizes } = useTheme();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { trackPageView, trackEvent } = useMatomo();
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler – Dashboard',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        () => {
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

    const activeMatches = useMemo(() => {
        return data?.me?.pupil?.matches?.filter((match) => !match.dissolved);
    }, [data?.me?.pupil?.matches]);

    const canRequestMatch = () => {
        if (DEACTIVATE_PUPIL_MATCH_REQUESTS === 'true') {
            return false;
        }

        if (data?.me?.pupil?.canRequestMatch?.reason === 'no-subjects-selected') {
            return true;
        }
        return data?.me?.pupil?.canRequestMatch?.allowed;
    };

    const handleOnRecommendClick = () => {
        navigate('/referral');
        trackEvent({
            category: 'Recommend Section on Start Page',
            action: 'Click Button “Recommend Now”',
            name: 'sus',
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
                            <Typography className="mb-4" variant="h3" as="p">
                                {t('hallo')} {data?.me.firstname}&nbsp;&nbsp;👋
                            </Typography>
                        </div>
                        <ImportantInformation variant="dark" />
                        <VStack>
                            <NextAppointmentCard appointments={data?.me?.appointments as Lecture[]} />
                            {/* Matches */}
                            {data?.myRoles?.includes('TUTEE') &&
                                ((activeMatches?.length ?? 0) > 0 || canRequestMatch() || (data?.me?.pupil?.openMatchRequestCount ?? 0) > 0) && (
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
                                        {canRequestMatch() && (
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
                                                {t(
                                                    activeMatches?.length
                                                        ? 'dashboard.helpers.buttons.requestMoreMatchesPupil'
                                                        : 'dashboard.helpers.buttons.requestFirstMatchPupil'
                                                )}
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

                                                <DisableableButton
                                                    isDisabled={_cancelMatchRequest?.loading}
                                                    reasonDisabled={t('reasonsDisabled.loading')}
                                                    width={ButtonContainer}
                                                    onPress={() => setShowCancelModal(true)}
                                                >
                                                    {t('dashboard.offers.removeRequest')}
                                                </DisableableButton>
                                            </VStack>
                                        )}
                                    </HSection>
                                )}

                            {/* Suggestions */}
                            {roles.includes('PARTICIPANT') && (data?.subcoursesPublic?.length ?? 0) > 0 && (
                                <HSection
                                    marginBottom={space['1.5']}
                                    title={t('dashboard.relatedcontent.header')}
                                    onShowAll={() => navigate('/group')}
                                    showAll={(data?.subcoursesPublic?.length ?? 0) > 4}
                                >
                                    {data?.subcoursesPublic?.slice(0, 4).map((subcourse) => (
                                        <div>
                                            <AppointmentCard
                                                key={subcourse.id}
                                                subcourseId={subcourse.id}
                                                description={subcourse.course.description}
                                                tags={subcourse.course.tags}
                                                dateNextLecture={subcourse?.nextLecture?.start ?? undefined}
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
                                        </div>
                                    ))}
                                </HSection>
                            )}
                            <VStack marginBottom={space['1.5']}>
                                <Heading marginBottom={space['1']}>{t('dashboard.helpers.headlines.recommend')}</Heading>
                                <CTACard
                                    title={t('dashboard.helpers.headlines.recommendFriends')}
                                    button={
                                        <NewButton variant="outline" className="w-full lg:w-fit" onClick={handleOnRecommendClick}>
                                            {t('dashboard.helpers.buttons.recommend')}
                                        </NewButton>
                                    }
                                    icon={<BooksIcon className="size-10" />}
                                >
                                    <div>
                                        <TruncatedText asChild maxLines={4}>
                                            <Typography className="whitespace-break-spaces text-pretty w-full">
                                                {t('dashboard.helpers.contents.recommendFriends')}
                                            </Typography>
                                        </TruncatedText>
                                    </div>
                                </CTACard>
                            </VStack>
                        </VStack>
                    </VStack>
                )}
            </WithNavigation>
            <ConfirmationModal
                isOpen={showCancelModal}
                onOpenChange={setShowCancelModal}
                onConfirm={cancelMatchRequestReaction}
                headline={t('matching.pending.modal.title')}
                description={t('matching.pending.modal.description')}
                confirmButtonText={t('matching.pending.modal.buttons.dissolve')}
                variant="destructive"
            />
        </AsNavigationItem>
    );
};
export default Dashboard;
