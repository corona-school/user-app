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
import AppointmentList from '../widgets/appointment/AppointmentList';
import { gql } from '../gql';
import { useQuery } from '@apollo/client';

// TODO get my appointments and pass data to AppointmentList
const myAppointmentsQuery = gql(`
    query myAppointments{
        me{
            appointments(take: 100){
                id
                title
                description
                start
                duration
                subcourseId
        }
        }
    }
`);
const Appointments: React.FC = () => {
    const userType = useUserType();
    // const {data, loading} = useQuery(myAppointmentsQuery)

    const navigate = useNavigate();
    const { space, sizes } = useTheme();
    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const buttonPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'top-right',
    });
    const { t } = useTranslation();

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation headerContent={<Hello />} headerTitle={t('appointment.title')} headerLeft={<NotificationAlert />}>
                {userType === 'student' && <AddAppointmentButton handlePress={() => navigate('/create-appointment')} place={buttonPlace} />}
                <VStack maxWidth={ContainerWidth} marginBottom={space['1']}>
                    <AppointmentList isReadOnly={false} />
                </VStack>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Appointments;
