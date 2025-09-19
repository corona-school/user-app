import { IconCalendarDown, IconCalendarPlus } from '@tabler/icons-react';
import { Button, ButtonProps } from './Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './Dropdown';
import { google, outlook, ics, CalendarEvent } from 'calendar-link';
import { Appointment } from '@/types/lernfair/Appointment';
import { useTranslation } from 'react-i18next';
import IconGoogle from '@/assets/icons/google.svg';
import IconOutlook from '@/assets/icons/outlook.svg';
import { formatDate } from '@/Utility';
import { DateTime } from 'luxon';
import { Lecture_Appointmenttype_Enum } from '@/gql/graphql';

interface AddToCalendarDropdownProps {
    appointment: Pick<Appointment, 'displayName' | 'title' | 'description' | 'start' | 'duration' | 'id' | 'override_meeting_link' | 'appointmentType'>;
    buttonClasses?: string;
    buttonVariant?: ButtonProps['variant'];
    onSelect?: (calendar: 'google' | 'outlook' | 'ics') => void;
}

const AddToCalendarDropdown = ({ appointment, buttonClasses, buttonVariant = 'outline', onSelect }: AddToCalendarDropdownProps) => {
    const { t } = useTranslation();
    const event: CalendarEvent = {
        title: appointment.displayName ?? appointment.title,
        start: appointment.start,
        duration: [appointment.duration, 'minutes'],
        description: appointment.description,
        location:
            appointment.appointmentType === Lecture_Appointmenttype_Enum.Screening
                ? appointment.override_meeting_link!
                : `${window.location.origin}/appointment/${appointment.id}`,
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className={buttonClasses} variant={buttonVariant} leftIcon={<IconCalendarPlus />}>
                    {t('appointment.addToCalendar')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(google(event));
                        onSelect?.('google');
                    }}
                >
                    <IconGoogle width={16} height={16} /> Google
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(outlook(event));
                        onSelect?.('outlook');
                    }}
                >
                    <IconOutlook /> Outlook
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement('a');
                        link.href = ics(event);
                        link.setAttribute('download', `Termin am ${formatDate(appointment.start, DateTime.DATETIME_SHORT)}.ics`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        onSelect?.('ics');
                    }}
                >
                    <IconCalendarDown /> ICS
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AddToCalendarDropdown;
