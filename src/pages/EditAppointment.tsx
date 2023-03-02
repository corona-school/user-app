import { Box } from 'native-base';
import { useParams } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import AppointmentEdit from './edit-appointment/AppointmentEdit';

const EditAppointment = () => {
    const { id } = useParams();
    const appointmentId = parseFloat(id ? id : '');

    return (
        <AsNavigationItem path="create-appointments">
            <WithNavigation>
                <Box mx="4">
                    <AppointmentEdit appointmentId={appointmentId} />
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default EditAppointment;
