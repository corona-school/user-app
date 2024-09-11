import { Box, Stack, useBreakpointValue, useToast } from 'native-base';
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
    const toast = useToast();
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

    const buttonPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'bottom-right',
    });

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
            toast.show({ description: t('appointment.loadedPastAppointments'), placement: 'top' });
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
                        <Stack alignItems="center" direction="row">
                            <SwitchLanguageButton />
                            <NotificationAlert />
                        </Stack>
                    )
                }
            >
                {(loadingMyAppointments || isLoadingHasAppointments) && <CenterLoadingSpinner />}
                {userType === 'student' && <FloatingActionButton handlePress={() => navigate('/create-appointment')} place={buttonPlace} />}

                {!hasAppointments && (
                    <Box h={500} justifyContent="center">
                        <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.noAppointmentsDesc')} />
                    </Box>
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
                    />
                )}
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Appointments;
