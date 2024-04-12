import { Box, Button, Divider, Heading, Stack, useTheme, useToast } from 'native-base';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import MatchPartner from './match/MatchPartner';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from './../gql';
import { useUserType } from '../hooks/useApollo';
import { Dissolve_Reason, Pupil, Student } from '../gql/graphql';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import DissolveMatchModal from '../modals/DissolveMatchModal';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import AlertMessage from '../widgets/AlertMessage';
import HelpNavigation from '../components/HelpNavigation';
import MatchAppointments from '../widgets/MatchAppointments';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentCreation from './create-appointment/AppointmentCreation';
import { pupilIdToUserId, studentIdToUserId } from '../helper/chat-helper';
import AsNavigationItem from '../components/AsNavigationItem';
import AdHocMeetingModal from '../modals/AdHocMeetingModal';
import { DateTime } from 'luxon';
import ReportMatchModal from '../modals/ReportMatchModal';
import { ScrollDirection } from './Appointments';

export const singleMatchQuery = gql(`
query SingleMatch($matchId: Int! ) {
  match(matchId: $matchId){
    id
    uuid
    createdAt
    dissolved
    dissolvedAt
    dissolveReason
    appointmentsCount
    lastAppointmentId
    pupil {
        id
        firstname
        lastname
        schooltype
        grade
        state
        subjectsFormatted {
            name
        }
        aboutMe
    }
    student {
        id
        firstname
        lastname
        state
        subjectsFormatted {
            name
        }
        aboutMe
    }
  }
}
`);

const appointmentsQuery = gql(`
query SingleMatchAppointments($matchId: Int!, $take: Float!, $skip: Float!, $cursor: Float, $direction: String) {
    match(matchId: $matchId) {
        appointments(take: $take, skip: $skip, cursor: $cursor,  direction: $direction) {
            id
            title
            description
            start
            duration
            appointmentType
            position
            displayName
            isOrganizer
            isParticipant
            override_meeting_link
            organizers(skip: 0, take: 5) {
                id
                firstname
                lastname
            }
            participants(skip: 0, take: 10) {
                id
                firstname
                lastname
            }
            total
        }
    }
}
`);

const matchChatMutation = gql(`
mutation createMatcheeChat($matcheeId: String!) {
  matchChatCreate(matcheeUserId: $matcheeId)
}
`);

const take = 10;

const SingleMatch = () => {
    const { trackEvent } = useMatomo();
    const navigate = useNavigate();
    const { id: _matchId } = useParams();
    const matchId = parseInt(_matchId ?? '', 10);
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const userType = useUserType();
    const toast = useToast();
    const [showDissolveModal, setShowDissolveModal] = useState<boolean>();
    const [showAdHocMeetingModal, setShowAdHocMeetingModal] = useState<boolean>(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [toastShown, setToastShown] = useState<boolean>();
    const [createAppointment, setCreateAppointment] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noNewAppointments, setNoNewAppointments] = useState<boolean>(false);
    const [noOldAppointments, setNoOldAppointments] = useState<boolean>(false);

    const {
        data,
        loading,
        error,
        refetch: refetchMatchData,
    } = useQuery(singleMatchQuery, {
        variables: {
            matchId,
        },
    });
    const {
        data: matchAppointments,
        loading: isLoadingAppointments,
        error: appointmentsError,
        refetch: refetchAppointments,
        fetchMore: fetchMoreAppointments,
    } = useQuery(appointmentsQuery, {
        variables: {
            matchId,
            take,
            skip: 0,
        },
    });

    const [createMatcheeChat] = useMutation(matchChatMutation);

    const [dissolveMatch, { data: dissolveData }] = useMutation(
        gql(`
            mutation dissolveMatchStudent2($matchId: Int!, $dissolveReasons: [dissolve_reason!]!) {
                matchDissolve(info: { matchId: $matchId, dissolveReasons: $dissolveReasons})
            }
        `)
    );

    const [createAdHocMeeting] = useMutation(
        gql(`
            mutation createAdHocMeeting($matchId: Int!){
                matchCreateAdHocMeeting(matchId: $matchId)
            }
        `)
    );
    const [trackJoinMeeting] = useMutation(
        gql(`
            mutation JoinMeeting($appointmentId: Float!) { 
                appointmentTrackJoin(appointmentId: $appointmentId)
            }
        `)
    );

    const refetch = useCallback(async () => {
        await Promise.all([refetchMatchData(), refetchAppointments()]);
    }, [refetchMatchData, refetchAppointments]);

    const totalAppointmentsCount = data?.match.appointmentsCount || 0;
    const dissolve = useCallback(
        async (reasons: Dissolve_Reason[]) => {
            setShowDissolveModal(false);
            trackEvent({
                category: 'matching',
                action: 'click-event',
                name: 'Helfer Matching lösen',
                documentTitle: 'Helfer Matching',
            });
            const dissolved = await dissolveMatch({
                variables: {
                    matchId: matchId || 0,
                    dissolveReasons: reasons,
                },
            });
            dissolved && refetch();
        },
        [dissolveMatch, matchId, refetch, trackEvent]
    );

    const appointments = matchAppointments?.match.appointments ?? [];

    const goBackToMatch = async () => {
        await refetch();
        setCreateAppointment(false);
    };

    const openChatContact = async () => {
        let contactId: string = '';
        if (userType === 'student' && data?.match?.pupil.id) contactId = pupilIdToUserId(data?.match?.pupil.id);
        if (userType === 'pupil' && data?.match?.student.id) contactId = studentIdToUserId(data?.match?.student.id);
        const conversation = await createMatcheeChat({ variables: { matcheeId: contactId } });
        navigate('/chat', { state: { conversationId: conversation?.data?.matchChatCreate } });
    };
    const startAdHocMeeting = useCallback(async () => {
        const meetingData = await createAdHocMeeting({ variables: { matchId: matchId } });
        const appointmentId = meetingData && meetingData.data?.matchCreateAdHocMeeting.id;
        const appointmentType = meetingData && meetingData.data?.matchCreateAdHocMeeting.appointmentType;

        if (!appointmentId || !appointmentType) {
            throw new Error('Couldnt start ad-hoc meeting, because no appointment was found.');
        }

        await trackJoinMeeting({ variables: { appointmentId } });
        navigate(`/video-chat/${appointmentId}/${appointmentType}`);
    }, [createAdHocMeeting, matchId, trackJoinMeeting, navigate]);

    const isActiveMatch = useMemo(() => {
        if (!data?.match.dissolved) return true;
        const today = DateTime.now().endOf('day');
        const dissolvedAtPlus30Days = DateTime.fromISO(data?.match.dissolvedAt).plus({ days: 30 });
        const before = dissolvedAtPlus30Days < today;
        return !before;
    }, [data?.match.dissolved, data?.match.dissolvedAt]);

    const overrideMeetingLink = useMemo(() => {
        const lastAppointment = appointments[appointments.length - 1];
        if (lastAppointment && lastAppointment.override_meeting_link !== null) {
            return lastAppointment.override_meeting_link;
        } else {
            return undefined;
        }
    }, [appointments]);

    useEffect(() => {
        if (dissolveData?.matchDissolve && !toastShown) {
            setToastShown(true);
            toast.show({ description: t('matching.shared.dissolved'), placement: 'top' });
        }
    }, [dissolveData?.matchDissolve, toast, toastShown]);

    const loadMoreAppointments = async (skip: number, cursor: number, scrollDirection: ScrollDirection) => {
        await fetchMoreAppointments({
            variables: { take, skip, cursor, direction: scrollDirection },
            updateQuery: (previousAppointments, { fetchMoreResult }) => {
                const newAppointments = fetchMoreResult?.match?.appointments;
                const prevAppointments = appointments;
                if (scrollDirection === 'next') {
                    if (!newAppointments || newAppointments.length === 0) {
                        setNoNewAppointments(true);
                        return previousAppointments;
                    }
                    return {
                        match: {
                            appointments: [...prevAppointments, ...newAppointments],
                        },
                    };
                } else {
                    if (!newAppointments || newAppointments.length === 0) {
                        setNoOldAppointments(true);
                        return previousAppointments;
                    }
                    return {
                        match: {
                            appointments: [...newAppointments, ...prevAppointments],
                        },
                    };
                }
            },
        });

        !noOldAppointments && scrollDirection === 'last' && toast.show({ description: t('appointment.loadedPastAppointments'), placement: 'top' });
    };

    const hasMoreAppointments = appointments.length < totalAppointmentsCount;

    return (
        <AsNavigationItem path="matching">
            <WithNavigation
                headerTitle={''}
                showBack={!createAppointment}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
                isLoading={isLoading}
            >
                {loading || !data ? (
                    <CenterLoadingSpinner />
                ) : (
                    !error && (
                        <Stack space={space['1']} paddingX={space['1.5']} mb={space[1.5]}>
                            {createAppointment ? (
                                <AppointmentCreation
                                    back={() => setCreateAppointment(false)}
                                    courseOrMatchId={matchId}
                                    isCourse={false}
                                    appointmentsTotal={totalAppointmentsCount}
                                    navigateToMatch={async () => await goBackToMatch()}
                                    overrideMeetingLink={overrideMeetingLink}
                                    setIsLoading={setIsLoading}
                                />
                            ) : (
                                <>
                                    {userType === 'student' ? (
                                        <MatchPartner partner={(data?.match?.pupil as Pupil) || {}} isPupil />
                                    ) : (
                                        <MatchPartner partner={(data?.match?.student as Student) || {}} />
                                    )}

                                    {data?.match?.dissolved && (
                                        <Stack direction={isMobile ? 'column' : 'row'} justifyContent="center" space={isMobile ? space['0.5'] : space['3']}>
                                            <AlertMessage
                                                content={t('matching.shared.dissolvedAlert', {
                                                    partnerName: userType === 'student' ? data?.match?.pupil?.firstname : data?.match?.student?.firstname,
                                                })}
                                            />
                                        </Stack>
                                    )}

                                    <Stack
                                        direction={isMobile ? 'column' : 'row'}
                                        flexWrap={isMobile ? 'nowrap' : 'wrap'}
                                        justifyContent="center"
                                        space={isMobile ? space['0.5'] : space['2']}
                                    >
                                        {isActiveMatch && (
                                            <Button onPress={() => openChatContact()} my={isMobile ? '0' : '1'}>
                                                {t('matching.shared.contactViaChat')}
                                            </Button>
                                        )}
                                        {userType === 'student' && !data?.match?.dissolved && (
                                            <Button onPress={() => setShowAdHocMeetingModal(true)} variant="outline" my={isMobile ? '0' : '1'}>
                                                {t('matching.shared.directCall')}
                                            </Button>
                                        )}
                                        {!data?.match?.dissolved && (
                                            <Button variant="outline" my={isMobile ? '0' : '1'} onPress={() => setShowDissolveModal(true)}>
                                                {t('matching.shared.dissolveMatch')}
                                            </Button>
                                        )}
                                        {isActiveMatch && (
                                            <Button variant="outline" onPress={() => setShowReportModal(true)} my={isMobile ? '0' : '1'}>
                                                {t('matching.shared.reportProblem')}
                                            </Button>
                                        )}
                                    </Stack>
                                    <Divider thickness={1} mb={4} />
                                    <Stack space={space['1']}>
                                        <Heading>{t('matching.shared.appointmentsHeadline')}</Heading>
                                    </Stack>
                                    <MatchAppointments
                                        appointments={appointments as Appointment[]}
                                        minimumHeight={'30vh'}
                                        loading={isLoadingAppointments}
                                        error={appointmentsError}
                                        dissolved={data?.match?.dissolved}
                                        loadMoreAppointments={loadMoreAppointments}
                                        noNewAppointments={noNewAppointments || !hasMoreAppointments}
                                        noOldAppointments={noOldAppointments || !hasMoreAppointments}
                                        hasAppointments={hasMoreAppointments || !!appointments.length}
                                        lastAppointmentId={data.match.lastAppointmentId}
                                    />
                                    {userType === 'student' && !data?.match?.dissolved && (
                                        <Box>
                                            <Divider thickness={1} mb={4} />
                                            <Stack direction={isMobile ? 'column' : 'row'} justifyContent="center" space={isMobile ? space['0'] : space['5']}>
                                                <Button variant="outline" onPress={() => setCreateAppointment(true)}>
                                                    {t('matching.shared.createAppointment')}
                                                </Button>
                                            </Stack>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Stack>
                    )
                )}

                <DissolveMatchModal
                    showDissolveModal={showDissolveModal}
                    alsoShowWarningModal={data?.match?.createdAt && new Date(data.match.createdAt).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 14}
                    onPressDissolve={async (reasons: Dissolve_Reason[]) => {
                        return await dissolve(reasons);
                    }}
                    onPressBack={() => setShowDissolveModal(false)}
                />
                <AdHocMeetingModal
                    showAdHocModal={showAdHocMeetingModal}
                    onPressAdHocMeeting={async () => {
                        await startAdHocMeeting();
                    }}
                    onPressBack={() => setShowAdHocMeetingModal(false)}
                />
                {data && data.match.pupil.firstname && data.match.student.firstname && (
                    <ReportMatchModal
                        matchName={userType === 'student' ? data.match.pupil.firstname : data.match.student.firstname}
                        matchId={data.match.id}
                        onClose={() => setShowReportModal(false)}
                        isOpen={showReportModal}
                    />
                )}
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default SingleMatch;
