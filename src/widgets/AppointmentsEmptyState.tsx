import { Typography } from '@/components/Typography';
import EmptyStateAppointments from '../assets/icons/lernfair/empty-state-appointments.svg';

type AppointmentsEmptyStateProps = {
    title: string;
    subtitle: string;
};

const AppointmentsEmptyState = ({ title, subtitle }: AppointmentsEmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <EmptyStateAppointments />
            <Typography variant="h5" as="p">
                {title}
            </Typography>
            <Typography className="max-w-80 text-center py-3">{subtitle}</Typography>
        </div>
    );
};
export default AppointmentsEmptyState;
