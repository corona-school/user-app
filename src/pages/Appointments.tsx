import { Box, useBreakpointValue, useTheme, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import AddAppointmentButton from '../widgets/AddAppointmentButton';
import Hello from '../widgets/Hello';
import { useUserType } from '../hooks/useApollo';
import { useQuery } from '@apollo/client';
import AppointmentList from '../widgets/appointment/AppointmentList';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import AppointmentsEmptyState from '../widgets/AppointmentsEmptyState';
import { gql } from '../gql/gql';
import { Appointment } from '../types/lernfair/Appointment';
import InfiniteScrollList from '../widgets/appointment/List';

const GET_MY_APPOINTMENTS = gql(`
    query myAppointments($take: Float, $skip: Float) {
        me {
            appointments(take: $take, skip: $skip) {
                id
                title
                description
                start
                duration
                organizers(skip: 0, take: 5) {
                    id
                    firstname
                    lastname
                }
                participants(skip: 0, take: 50) {
                    id
                    firstname
                    lastname
                    isPupil
                    isStudent
                }
            }
        }
    }
`);

const Appointments: React.FC = () => {
    const userType = useUserType();
    const take = 10;
    const skip = 0;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data, loading, error, fetchMore } = useQuery(GET_MY_APPOINTMENTS, {
        variables: { take, skip },
    });

    const buttonPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'top-right',
    });

    const appointments = data?.me?.appointments ?? [];

    const loadMoreAppointments = () => {
        fetchMore({
            variables: { take: 10, skip: appointments.length + 10 },
            updateQuery: (previousAppointments, { fetchMoreResult }) => {
                const newAppointments = fetchMoreResult?.me?.appointments;
                const prevAppointments = previousAppointments?.me?.appointments ?? [];
                if (!newAppointments || newAppointments.length === 0) return previousAppointments;
                return {
                    ...previousAppointments,
                    me: {
                        appointments: [...prevAppointments, ...newAppointments],
                    },
                };
            },
        });
    };

    // useEffect(() => {
    //     if (isEndOfList) loadMoreAppointments();
    // }, [isEndOfList]);

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation headerContent={<Hello />} headerTitle={t('appointment.title')} headerLeft={<NotificationAlert />}>
                {loading && !data && <CenterLoadingSpinner />}
                {userType === 'student' && <AddAppointmentButton handlePress={() => navigate('/create-appointment')} place={buttonPlace} />}
                {!error && appointments.length > 0 ? (
                    // <AppointmentList isReadOnly={false} appointments={appointments as Appointment[]} isEndOfList={isEndOfList} setEndOfList={setIsEndOfList} />
                    <InfiniteScrollList
                        isLoadingAppointments={loading}
                        appointments={appointments as Appointment[]}
                        isReadOnlyList={false}
                        loadMoreAppointments={() => loadMoreAppointments()}
                    />
                ) : (
                    <Box h={800} justifyContent="center">
                        <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.noAppointmentsDesc')} />
                    </Box>
                )}
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Appointments;
