import { Separator } from '@/components/Separator';
import { Appointment } from '@/types/lernfair/Appointment';
import AppointmentsEmptyState from '@/widgets/AppointmentsEmptyState';
import { useTranslation } from 'react-i18next';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentDivider } from './AppointmentDivider';

type ScrollDirection = 'next' | 'last';

interface AppointmentListProps {
    appointments: Appointment[];
    // Hides the show button
    isReadOnly?: boolean;
    // Prevents auto scroll to a specific item
    disableScroll?: boolean;
    // For infinite scroll purposes
    hasMoreNewAppointments?: boolean;
    // For infinite scroll purposes
    hasMoreOldAppointments?: boolean;
    isLoading?: boolean;
    // Pagination
    loadMoreAppointments?: (skip: number, cursor: number, direction: ScrollDirection) => void;
    lastAppointmentId?: number | null;
    isHomeworkHelp?: boolean;
}

export const AppointmentList = ({ appointments, isReadOnly, isLoading, isHomeworkHelp }: AppointmentListProps) => {
    const { t } = useTranslation();
    if (!isLoading && !appointments.length) {
        return (
            <div className="justify-center">
                <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.noAppointmentsDesc')} />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-y-6 max-w-[980px]">
            <Separator orientation="horizontal" decorative className="" />
            {appointments.map((appointment, index) => (
                <div key={appointment.id}>
                    <AppointmentDivider appointments={appointments} index={index} />
                    <AppointmentCard appointment={appointment} isReadOnly={isReadOnly} isHomeworkHelp={isHomeworkHelp} />
                </div>
            ))}
        </div>
    );
};
