import { Box, Stack } from 'native-base';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import AppointmentCreation from './create-appointment/AppointmentCreation';
import HelpNavigation from '../components/HelpNavigation';

const CreateCourseAppointment = () => {
    const navigate = useNavigate();

    return (
        <AsNavigationItem path="course">
            <WithNavigation
                headerTitle="Termin erstellen"
                showBack
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                <Box mx="4">
                    <AppointmentCreation back={() => navigate('/create-course', { state: { currentStep: 1 } })} isCourseCreation={true} />
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default CreateCourseAppointment;
