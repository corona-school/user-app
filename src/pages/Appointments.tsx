import { Box, Stack, useBreakpointValue, useToast } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import FloatingActionButton from '../components/FloatingActionButton';
import Hello from '../widgets/Hello';
import { useUserType } from '../hooks/useApollo';
import { useQuery } from '@apollo/client';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import AppointmentsEmptyState from '../widgets/AppointmentsEmptyState';
import { gql } from './../gql';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentList from '../widgets/AppointmentList';
import HelpNavigation from '../components/HelpNavigation';

const getMyAppointments = gql(`
    query myAppointments($take: Float!, $skip: Float!, $cursor: Float, $direction: String) {
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
        }
    }
`);

export type ScrollDirection = 'next' | 'last';
const take = 10;

const Appointments: React.FC = () => {
    const userType = useUserType();
    const toast = useToast();
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [noNewAppointments, setNoNewAppointments] = useState<boolean>(false);
    const [noOldAppointments, setNoOldAppointments] = useState<boolean>(false);

    const { data: myAppointments, loading: loadingMyAppointments, error, fetchMore } = useQuery(getMyAppointments, { variables: { take, skip: 0 } });
    const { data: hasAppointments, loading: isLoadingHasAppointments } = useQuery(APPOINTMENTS_META_DATA);

    const buttonPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'bottom-right',
    });

    const appointments = myAppointments?.me?.appointments ?? [];

    const loadMoreAppointments = async (skip: number, cursor: number, scrollDirection: ScrollDirection) => {
        await fetchMore({
            variables: { take: take, skip: skip, cursor: cursor, direction: scrollDirection },
            updateQuery: (previousAppointments, { fetchMoreResult }) => {
                const newAppointments = fetchMoreResult?.me?.appointments;
                const prevAppointments = appointments;
                if (scrollDirection === 'next') {
                    if (!newAppointments || newAppointments.length === 0) {
                        setNoNewAppointments(true);
                        return previousAppointments;
                    }
                    return {
                        me: {
                            appointments: [...prevAppointments, ...newAppointments],
                        },
                    };
                } else {
                    if (!newAppointments || newAppointments.length === 0) {
                        setNoOldAppointments(true);
                        return previousAppointments;
                    }
                    return {
                        me: {
                            appointments: [...newAppointments, ...prevAppointments],
                        },
                    };
                }
            },
        });

        !noOldAppointments && scrollDirection === 'last' && toast.show({ description: 'Vergangene Termine geladen', placement: 'top' });
    };

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation
                headerContent={<Hello />}
                headerTitle={t('appointment.title')}
                headerLeft={
                    userType !== 'screener' && (
                        <Stack alignItems="center" direction="row">
                            <HelpNavigation />
                            <NotificationAlert />
                        </Stack>
                    )
                }
            >
                {((loadingMyAppointments && !myAppointments) || isLoadingHasAppointments) && <CenterLoadingSpinner />}
                {userType === 'student' && <FloatingActionButton handlePress={() => navigate('/create-appointment')} place={buttonPlace} />}

                {!isLoadingHasAppointments && !hasAppointments?.me.hasAppointments && (
                    <Box h={500} justifyContent="center">
                        <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.noAppointmentsDesc')} />
                    </Box>
                )}

                {!error && hasAppointments?.me.hasAppointments && (
                    <AppointmentList
                        appointments={appointments as Appointment[]}
                        isLoadingAppointments={loadingMyAppointments}
                        isReadOnlyList={false}
                        loadMoreAppointments={loadMoreAppointments}
                        noNewAppointments={noNewAppointments}
                        noOldAppointments={noOldAppointments}
                        lastAppointmentId={hasAppointments?.me?.lastAppointmentId}
                    />
                )}
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Appointments;
