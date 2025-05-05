import { useParams } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import AppointmentEdit from './edit-appointment/AppointmentEdit';
import NotificationAlert from '../components/notifications/NotificationAlert';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';

const EditAppointment = () => {
    const { id } = useParams();
    const appointmentId = parseFloat(id ? id : '');

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation
                headerLeft={
                    <div className="flex">
                        <NotificationAlert />
                        <SwitchLanguageButton />
                    </div>
                }
                previousFallbackRoute={`/appointment/${appointmentId}`}
            >
                <div className="flex flex-col flex-1 h-full max-w-5xl mx-auto">
                    <AppointmentEdit appointmentId={appointmentId} />
                </div>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default EditAppointment;
