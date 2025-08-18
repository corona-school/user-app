import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import FloatingActionButton from '../components/FloatingActionButton';
import useApollo, { QueryResult, useUserType } from '../hooks/useApollo';
import { useQuery } from '@apollo/client';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import AppointmentsEmptyState from '../widgets/AppointmentsEmptyState';
import { gql } from './../gql';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentList from '../widgets/AppointmentList';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import { Breadcrumb } from '@/components/Breadcrumb';
import { toast } from 'sonner';

const getMyAppointments = gql(`
    query myAppointments_NO_CACHE($take: Float!, $skip: Float!, $cursor: Float, $direction: String) {
        me {
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
                }
            }            
        }
    }
`);
const APPOINTMENTS_META_DATA = gql(`
    query appoimtmentsMetaData {
        me {
            hasAppointments
            lastAppointmentId
            firstAppointmentId
        }
    }
`);

export type ScrollDirection = 'next' | 'last';
const take = 10;

const Appointments: React.FC = () => {
    const userType = useUserType();
    const { t } = useTranslation();
    const [isFetchingMoreAppointments, setIsFetchingMoreAppointments] = useState(false);
    const navigate = useNavigate();
    const { client } = useApollo();

    type Appointments = Exclude<QueryResult<typeof getMyAppointments>['me']['appointments'], null | undefined>;
    const [appointments, setAppointments] = useState<Appointments>([]);

    const [loadingMyAppointments, setLoadingMyAppointments] = useState(true);

    useEffect(() => {
        (async function () {
            const {
                data: {
                    me: { appointments },
                },
            } = await client.query({
                query: getMyAppointments,
                variables: { take, skip: 0 },
            });
            setAppointments(appointments!);
            setLoadingMyAppointments(false);
        })();
    }, [client]);

    const { data: hasAppointmentsResult, loading: isLoadingHasAppointments } = useQuery(APPOINTMENTS_META_DATA);

    const loadMoreAppointments = async (skip: number, cursor: number, scrollDirection: ScrollDirection) => {
        setIsFetchingMoreAppointments(true);
        const {
            data: {
                me: { appointments },
            },
        } = await client.query({
            query: getMyAppointments,
            variables: { take: take, skip: skip, cursor: cursor, direction: scrollDirection },
        });

        if (scrollDirection === 'last') {
            toast.info(t('appointment.loadedPastAppointments'), { duration: 2000 });
        }

        setAppointments((prev) => (scrollDirection === 'last' ? [...appointments!, ...prev] : [...prev, ...appointments!]));
        setIsFetchingMoreAppointments(false);
    };

    const hasAppointments = !isLoadingHasAppointments && hasAppointmentsResult?.me.hasAppointments;
    const hasMoreOldAppointments = !appointments.some((e) => e.id === hasAppointmentsResult?.me?.firstAppointmentId);
    const hasMoreNewAppointments = !appointments.some((e) => e.id === hasAppointmentsResult?.me?.lastAppointmentId);

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation
                headerTitle={t('appointment.title')}
                headerLeft={
                    userType !== 'screener' && (
                        <div className="flex items-center">
                            <SwitchLanguageButton />
                            <NotificationAlert />
                        </div>
                    )
                }
            >
                <div className="flex flex-col flex-1 h-full max-w-5xl mx-auto items-center">
                    <Breadcrumb className="self-baseline" />
                    {(loadingMyAppointments || isLoadingHasAppointments) && <CenterLoadingSpinner />}
                    {userType === 'student' && <FloatingActionButton handlePress={() => navigate('/create-appointment')} place="bottom-right" />}

                    {!hasAppointments && (
                        <div className="flex h-full items-center justify-center">
                            <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.noAppointmentsDesc')} />
                        </div>
                    )}

                    {hasAppointments && (
                        <AppointmentList
                            appointments={appointments as Appointment[]}
                            isLoadingAppointments={loadingMyAppointments || isFetchingMoreAppointments}
                            isReadOnlyList={false}
                            loadMoreAppointments={loadMoreAppointments}
                            noNewAppointments={!hasMoreNewAppointments || !hasAppointments}
                            noOldAppointments={!hasMoreOldAppointments || !hasAppointments}
                            lastAppointmentId={hasAppointmentsResult?.me?.lastAppointmentId}
                            height="100%"
                            clickable={true}
                            editable={false}
                        />
                    )}
                </div>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Appointments;
