import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import MatchPartner from './match/MatchPartner';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from './../gql';
import useApollo, { QueryResult, useUserType } from '../hooks/useApollo';
import { DayAvailabilitySlot, Pupil, Student } from '../gql/graphql';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AlertMessage from '../widgets/AlertMessage';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import MatchAppointments from '../widgets/MatchAppointments';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentCreation from './create-appointment/AppointmentCreation';
import AsNavigationItem from '../components/AsNavigationItem';
import { DateTime } from 'luxon';
import { ScrollDirection } from './Appointments';
import { Typography } from '@/components/Typography';
import { MatchAvailability } from '@/components/availability/MatchAvailability';
import { Day, DAYS } from '@/Utility';
import ConfirmationModal from '@/modals/ConfirmationModal';
import i18n from 'i18next';
import { useBreadcrumbRoutes } from '@/hooks/useBreadcrumb';
import { Breadcrumb } from '@/components/Breadcrumb';
import { MatchButtons } from './match/MatchButtons';
import { Button } from '@/components/Button';
import { toast } from 'sonner';

export const singleMatchQuery = gql(`
query SingleMatch($matchId: Int! ) {
  match(matchId: $matchId){
    id
    uuid
    createdAt
    dissolved
    dissolvedAt
    appointmentsCount
    lastAppointmentId
    firstAppointmentId
    matchWeeklyAvailability
    pupil {
        id
        firstname
        lastname
        schooltype
        grade
        gradeAsInt
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
query SingleMatchAppointments_NO_CACHE($matchId: Int!, $take: Float!, $skip: Float!, $cursor: Float, $direction: String) {
    match(matchId: $matchId) {
        appointments(take: $take, skip: $skip, cursor: $cursor,  direction: $direction) {
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
            override_meeting_link
            declinedBy
            organizers(skip: 0, take: 5) {
                id
                firstname
                lastname
            }
            participants(skip: 0, take: 10) {
                userID
                id
                firstname
                lastname
            }

        }
    }
}`);

const take = 10;

const SingleMatch = () => {
    const { id: _matchId } = useParams();
    const matchId = parseInt(_matchId ?? '', 10);
    const { t } = useTranslation();
    const userType = useUserType();
    const [createAppointment, setCreateAppointment] = useState<boolean>(false);
    const [isFetchingMoreAppointments, setIsFetchingMoreAppointments] = useState(false);
    const [isConfirmCreateAppointmentModalOpen, setIsConfirmCreateAppointmentModalOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<DateTime | null>(null);
    const { client } = useApollo();

    const { data, refetch: refetchMatchData } = useQuery(singleMatchQuery, {
        variables: {
            matchId,
        },
    });

    const {
        data: appointmentsData,
        refetch: refetchAppointments,
        loading: isLoadingAppointments,
    } = useQuery(appointmentsQuery, {
        variables: {
            matchId,
            take,
            skip: 0,
        },
    });

    type Appointments = QueryResult<typeof appointmentsQuery>['match']['appointments'];
    const [appointments, setAppointments] = useState<Appointments>([]);

    useEffect(() => {
        if (appointmentsData?.match?.appointments) {
            setAppointments(appointmentsData.match.appointments);
        }
    }, [appointmentsData]);

    const refetch = useCallback(async () => {
        await Promise.all([refetchMatchData(), refetchAppointments()]);
    }, [refetchMatchData, refetchAppointments]);

    const totalAppointmentsCount = data?.match.appointmentsCount || 0;

    const goBackToMatch = async () => {
        await refetch();
        setCreateAppointment(false);
        setSelectedDateTime(null);
    };

    const handleOnSlotClick = (day: Day, slot: DayAvailabilitySlot) => {
        const weekday = DAYS.indexOf(day) + 1;
        const today = DateTime.now();
        const daysUntilTarget = (weekday + 7 - today.weekday) % 7 || 7;
        setSelectedDateTime(today.startOf('day').plus({ days: daysUntilTarget, minutes: slot.from }));
        setIsConfirmCreateAppointmentModalOpen(true);
    };

    const handleOnCancelAppointmentCreation = async () => {
        setSelectedDateTime(null);
        await refetchAppointments();
        setCreateAppointment(false);
    };

    const overrideMeetingLink = useMemo(() => {
        const lastAppointment = appointments[appointments.length - 1];
        if (lastAppointment && lastAppointment.override_meeting_link !== null) {
            return lastAppointment.override_meeting_link;
        } else {
            return undefined;
        }
    }, [appointments]);

    const loadMoreAppointments = async (skip: number, cursor: number, scrollDirection: ScrollDirection) => {
        setIsFetchingMoreAppointments(true);
        const {
            data: {
                match: { appointments },
            },
        } = await client.query({
            query: appointmentsQuery,
            variables: { matchId, take, skip, cursor, direction: scrollDirection },
        });

        if (scrollDirection === 'last') {
            toast.info(t('appointment.loadedPastAppointments'));
        }

        setAppointments((prev) => (scrollDirection === 'next' ? [...prev, ...appointments] : [...appointments, ...prev]));
        setIsFetchingMoreAppointments(false);
    };

    const hasMoreAppointments = appointments.length < totalAppointmentsCount;
    const hasMoreOldAppointments = !appointments.some((e) => e.id === data?.match.firstAppointmentId);
    const hasMoreNewAppointments = !appointments.some((e) => e.id === data?.match.lastAppointmentId);

    const breadcrumbRoutes = useBreadcrumbRoutes();
    const partner = userType === 'student' ? data?.match.pupil : data?.match.student;
    const partnerName = partner ? `${partner.firstname} ${partner.lastname}` : '...';
    return (
        <AsNavigationItem path="matching">
            <WithNavigation
                previousFallbackRoute="/matching"
                headerLeft={
                    <div className="flex items-start">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                <div className="flex flex-col px-4 gap-y-10 mb-10">
                    {createAppointment ? (
                        <div className="px-2 mb-2">
                            <AppointmentCreation
                                back={handleOnCancelAppointmentCreation}
                                courseOrMatchId={matchId}
                                appointmentsTotal={totalAppointmentsCount}
                                navigateToMatch={async () => await goBackToMatch()}
                                overrideMeetingLink={overrideMeetingLink}
                                defaultDate={selectedDateTime?.toISODate()}
                                defaultTime={selectedDateTime?.toFormat('HH:mm')}
                            />
                        </div>
                    ) : (
                        <>
                            <Breadcrumb items={[breadcrumbRoutes.MATCHING, { label: partnerName }]} className="self-start" />
                            {userType === 'student' ? (
                                <MatchPartner partner={data?.match?.pupil as Pupil} isPupil isLoading={!data} />
                            ) : (
                                <MatchPartner partner={data?.match?.student as Student} isLoading={!data} />
                            )}
                            <MatchButtons match={data?.match} isLoading={!data} refresh={refetchMatchData} />
                            {data?.match?.dissolved && (
                                <div className="flex flex-col md:flex-row justify-center">
                                    <AlertMessage
                                        content={t('matching.shared.dissolvedAlert', {
                                            partnerName: userType === 'student' ? data?.match?.pupil?.firstname : data?.match?.student?.firstname,
                                        })}
                                    />
                                </div>
                            )}
                            {!data?.match?.dissolved && (
                                <div>
                                    <Typography variant="h4" className="h4 mb-4">
                                        {t('matching.availability.title')}
                                    </Typography>
                                    <MatchAvailability
                                        matchAvailability={data?.match?.matchWeeklyAvailability}
                                        onSlotClick={userType === 'student' ? handleOnSlotClick : undefined}
                                        isLoading={false}
                                    />
                                </div>
                            )}
                            <div>
                                <Typography variant="h4">{t('matching.shared.appointmentsHeadline')}</Typography>
                                <MatchAppointments
                                    appointments={appointments as Appointment[]}
                                    minimumHeight={'30vh'}
                                    loading={isLoadingAppointments || isFetchingMoreAppointments}
                                    dissolved={!!data?.match?.dissolved}
                                    loadMoreAppointments={loadMoreAppointments}
                                    noNewAppointments={!hasMoreNewAppointments || !hasMoreAppointments}
                                    noOldAppointments={!hasMoreOldAppointments || !hasMoreAppointments}
                                    hasAppointments={hasMoreAppointments || !!appointments.length}
                                    lastAppointmentId={data?.match?.lastAppointmentId}
                                />
                                {userType === 'student' && !data?.match?.dissolved && (
                                    <div className="flex flex-col md:flex-row justify-center">
                                        <Button className="md:max-w-[200px] w-full" variant="outline" onClick={() => setCreateAppointment(true)}>
                                            {t('matching.shared.createAppointment')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <ConfirmationModal
                    headline={t('matching.availability.createAppointmentModal.title')}
                    confirmButtonText={t('yes')}
                    cancelButtonText={t('back')}
                    description={
                        selectedDateTime && <Typography>{selectedDateTime.toFormat('cccc, dd. LLLL yyyy HH:mm', { locale: i18n.language })}</Typography>
                    }
                    onConfirm={() => {
                        setCreateAppointment(true);
                        setIsConfirmCreateAppointmentModalOpen(false);
                    }}
                    isOpen={isConfirmCreateAppointmentModalOpen}
                    onOpenChange={setIsConfirmCreateAppointmentModalOpen}
                />
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default SingleMatch;
