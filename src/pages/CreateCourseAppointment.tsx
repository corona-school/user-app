import { Box } from 'native-base';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import AppointmentCreation from './create-appointment/AppointmentCreation';

const CreateCourseAppointment = () => {
    return (
        <AsNavigationItem path="create-course-appointment">
            <WithNavigation headerTitle="Termin erstellen" showBack headerLeft={<NotificationAlert />}>
                <Box mx="4">
                    <AppointmentCreation back={() => console.log('navigate to Kursterminerstellung')} />
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default CreateCourseAppointment;
