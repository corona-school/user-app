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
    <div className="flex gap-x-2 lg:gap-x-3 items-center">
        <div>{icon}</div>
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
    const appointmentTitle =
        t('appointment.appointmentTile.lecture', { position: appointment.position }) +
        (appointment.title ? t('appointment.appointmentTile.title', { appointmentTitle: appointment.title }) : '');
    return (
        <div className="flex flex-col lg:flex-row items-center lg:h-[84px] max-w-[980px] py-4 px-4 lg:pl-9 lg:pr-7 border border-gray-300 rounded">
            <div className="flex flex-col">
                <Typography variant="sm">{DateTime.fromISO(appointment.start).weekdayLong}</Typography>
                <Typography variant="h4" as="p">
                    {DateTime.fromISO(appointment.start).toFormat('d.L.')}
                </Typography>
            </div>
            <Separator orientation="vertical" decorative className="ml-6 mr-8" />
            <div className="grid grid-cols-2 grid-rows-2 lg:gap-x-10 gap-y-2 w-full">
                <AppointmentFact icon={<IconClock size={18} />}>
                    <Typography variant="sm">{getAppointmentTimeText(appointment.start, appointment.duration)}</Typography>
                </AppointmentFact>
                <AppointmentFact icon={<IconVideo size={18} />}>
                    <Typography variant="sm" className="line-clamp-1" title={appointment.displayName}>
                        {appointment.displayName}
                    </Typography>
                </AppointmentFact>
                {appointment.participantIds && appointment.declinedBy && (
                    <AppointmentFact icon={<IconUsersGroup size={18} />}>
                        <Typography variant="sm">
                            {t('single.global.status.lastSeats', { seatsFull: totalParticipants - declinedParticipants, seatsMax: totalParticipants })}
                        </Typography>
                    </AppointmentFact>
                )}
                <AppointmentFact icon={<IconBook size={18} />}>
                    <Typography variant="sm" className="line-clamp-1" title={appointmentTitle}>
                        {appointmentTitle}
                    </Typography>
                </AppointmentFact>
            </div>
            {!isReadOnly && (
                <Button
                    onClick={() => navigate(`/appointment/${appointment.id}`)}
                    variant="outline"
                    rightIcon={<IconChevronRight size={16} />}
                    className="w-full mt-2 lg:mt-0 lg:w-fit ml-auto"
                >
                    {t('show')}
                </Button>
            )}
        </div>
    );
};
