import { Box } from 'native-base';
import { useParams } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import AppointmentEdit from './edit-appointment/AppointmentEdit';
import NotificationAlert from '../components/notifications/NotificationAlert';

const EditAppointment = () => {
    const { id } = useParams();
    const appointmentId = parseFloat(id ? id : '');

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation headerLeft={<NotificationAlert />} showBack previousFallbackRoute={`/appointment/${appointmentId}`}>
                <Box mx="4">
                    <AppointmentEdit appointmentId={appointmentId} />
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default EditAppointment;
