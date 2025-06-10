import { IconCalendarDown, IconCalendarPlus } from '@tabler/icons-react';
import { Button } from './Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './Dropdown';
import { google, outlook, ics, CalendarEvent } from 'calendar-link';
import { Appointment } from '@/types/lernfair/Appointment';
import { useTranslation } from 'react-i18next';
import IconGoogle from '@/assets/icons/google.svg';
import IconOutlook from '@/assets/icons/outlook.svg';
import { formatDate } from '@/Utility';
import { DateTime } from 'luxon';

interface AddToCalendarDropdownProps {
    appointment: Appointment;
}

const AddToCalendarDropdown = ({ appointment }: AddToCalendarDropdownProps) => {
    const { t } = useTranslation();
    const event: CalendarEvent = {
        title: appointment.displayName ?? appointment.title,
        start: appointment.start,
        duration: [appointment.duration, 'minutes'],
        description: appointment.description,
        location: `${window.location.origin}/appointment/${appointment.id}`,
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" leftIcon={<IconCalendarPlus />}>
                    {t('appointment.addToCalendar')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => window.open(google(event))}>
                    <IconGoogle width={16} height={16} /> Google
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(outlook(event))}>
                    <IconOutlook /> Outlook
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = ics(event);
                        link.setAttribute('download', `Termin am ${formatDate(appointment.start, DateTime.DATETIME_SHORT)}.ics`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    }}
                >
                    <IconCalendarDown /> ICS
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AddToCalendarDropdown;
