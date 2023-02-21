import { Box } from 'native-base';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import { CreateAppointmentProvider } from '../context/AppointmentContext';
import AppointmentCreation from './create-appointment/AppointmentCreation';

const CreateCourseAppointment = () => {
    const navigate = useNavigate();

    return (
        <CreateAppointmentProvider>
            <AsNavigationItem path="create-course-appointment">
                <WithNavigation headerTitle="Termin erstellen" showBack headerLeft={<NotificationAlert />}>
                    <Box mx="4">
                        <AppointmentCreation back={() => navigate('/create-course', { state: { currentStep: 1 } })} />
                    </Box>
                </WithNavigation>
            </AsNavigationItem>
        </CreateAppointmentProvider>
    );
};

export default CreateCourseAppointment;
