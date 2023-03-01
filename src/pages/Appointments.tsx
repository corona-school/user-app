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
import { gql, useQuery } from '@apollo/client';
import AppointmentList from '../widgets/appointment/AppointmentList';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import AppointmentsEmptyState from '../widgets/AppointmentsEmptyState';

const GET_MY_APPOINTMENTS = gql`
    query myAppointments($take: Float, $skip: Float) {
        me {
            appointments(take: $take, skip: $skip) {
                id
                title
                description
                start
                duration
                subcourseId
                matchId
                organizers(skip: 0, take: 5) {
                    id
                    firstname
                    lastname
                }
                participants(skip: 0, take: 30) {
                    id
                    firstname
                    lastname
                    isPupil
                    isStudent
                }
                meetingLink
                appointmentType
            }
        }
    }
`;

const Appointments: React.FC = () => {
    const userType = useUserType();
    const take = 20;
    const skip = 0;
    const [isEndOfList, setIsEndOfList] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data, loading, error, fetchMore } = useQuery(GET_MY_APPOINTMENTS, {
        variables: { take, skip },
    });

    const buttonPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'top-right',
    });

    const loadMoreAppointments = () => {
        fetchMore({
            variables: { take, skip: skip + take },
            updateQuery: (previousAppointments, { fetchMoreResult }) => {
                const newAppointments = fetchMoreResult.me.appointments;
                return newAppointments.length
                    ? {
                          ...previousAppointments,
                          me: {
                              appointments: [...previousAppointments.me.appointments, ...newAppointments],
                          },
                      }
                    : previousAppointments;
            },
        });
    };

    useEffect(() => {
        if (isEndOfList) loadMoreAppointments();
    }, [isEndOfList]);

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation headerContent={<Hello />} headerTitle={t('appointment.title')} headerLeft={<NotificationAlert />}>
                {loading && <CenterLoadingSpinner />}
                {userType === 'student' && <AddAppointmentButton handlePress={() => navigate('/create-appointment')} place={buttonPlace} />}
                {!error && data?.me?.appointments.length > 0 ? (
                    <AppointmentList isReadOnly={false} appointments={data?.me?.appointments} isEndOfList={isEndOfList} setEndOfList={setIsEndOfList} />
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
