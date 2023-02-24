import { useBreakpointValue, useTheme, VStack } from 'native-base';
import React from 'react';
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

const myAppointmentsQuery = gql`
    query myAppointments {
        me {
            appointments(take: 100) {
                id
                title
                description
                start
                duration
                subcourseId
                matchId
                meetingLink
                appointmentType
            }
        }
    }
`;
const Appointments: React.FC = () => {
    const userType = useUserType();
    const { data, loading, error, refetch } = useQuery(myAppointmentsQuery);

    const navigate = useNavigate();

    const buttonPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'top-right',
    });
    const { t } = useTranslation();

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation headerContent={<Hello />} headerTitle={t('appointment.title')} headerLeft={<NotificationAlert />}>
                {loading && <CenterLoadingSpinner />}
                {userType === 'student' && <AddAppointmentButton handlePress={() => navigate('/create-appointment')} place={buttonPlace} />}
                {!error && <AppointmentList isReadOnly={false} appointments={data?.me?.appointments} />}
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Appointments;
