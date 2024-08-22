import { Button } from '@/components/Button';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { Appointment } from '@/types/lernfair/Appointment';
import { IconBook, IconChevronRight, IconClock, IconUsersGroup, IconVideo } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface AppointmentCardProps {
    appointment: Appointment;
    isReadOnly?: boolean;
}

interface AppointmentFactProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

const AppointmentFact = ({ children, icon }: AppointmentFactProps) => (
    <div className="flex gap-x-3 items-center">
        {icon}
        {children}
    </div>
);

export const AppointmentCard = ({ appointment, isReadOnly }: AppointmentCardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const getAppointmentTimeText = (start: string, duration: number): string => {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(start);
        const end = startDate.plus({ minutes: duration });

        const startTime = startDate.setLocale('de-DE').toFormat('T');
        const endTime = end.setLocale('de-DE').toFormat('T');

        if (startDate <= now && now <= end) {
            return t('appointment.clock.nowToEnd', { end: endTime });
        }
        return t('appointment.clock.startToEnd', { start: startTime, end: endTime });
    };

    const totalParticipants = appointment.participantIds?.length || 0;
    const declinedParticipants = appointment.declinedBy?.length || 0;
    return (
        <div className="flex items-center h-[84px] max-w-[980px] py-4 pl-9 pr-7 border border-gray-300 rounded">
            <div className="flex flex-col">
                <Typography variant="sm">{DateTime.fromISO(appointment.start).weekdayLong}</Typography>
                <Typography variant="h4" as="p">
                    {DateTime.fromISO(appointment.start).toFormat('d.L.')}
                </Typography>
            </div>
            <Separator orientation="vertical" decorative className="ml-6 mr-8" />
            <div className="grid grid-cols-2 grid-rows-2 gap-x-10 gap-y-2">
                <AppointmentFact icon={<IconClock size={18} />}>
                    <Typography variant="sm">{getAppointmentTimeText(appointment.start, appointment.duration)}</Typography>
                </AppointmentFact>
                <AppointmentFact icon={<IconVideo size={18} />}>
                    <Typography variant="sm">{appointment.displayName}</Typography>
                </AppointmentFact>
                {appointment.participantIds && appointment.declinedBy && (
                    <AppointmentFact icon={<IconUsersGroup size={18} />}>
                        <Typography variant="sm">
                            {t('single.global.status.lastSeats', { seatsFull: totalParticipants - declinedParticipants, seatsMax: totalParticipants })}
                        </Typography>
                    </AppointmentFact>
                )}
                <AppointmentFact icon={<IconBook size={18} />}>
                    <Typography variant="sm">
                        {t('appointment.appointmentTile.lecture', { position: appointment.position }) +
                            (appointment.title ? t('appointment.appointmentTile.title', { appointmentTitle: appointment.title }) : '')}
                    </Typography>
                </AppointmentFact>
            </div>
            {!isReadOnly && (
                <Button
                    onClick={() => navigate(`/appointment/${appointment.id}`)}
                    variant="outline"
                    rightIcon={<IconChevronRight size={16} />}
                    className="ml-auto"
                >
                    {t('show')}
                </Button>
            )}
        </div>
    );
};
