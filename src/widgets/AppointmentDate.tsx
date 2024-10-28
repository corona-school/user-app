import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { DateTime } from 'luxon';

type Props = {
    current: boolean;
    date: string;
    color?: string;
    isReadOnly?: boolean;
};

const AppointmentDate: React.FC<Props> = ({ current, date, color, isReadOnly = false }) => {
    return (
        <div className={cn('flex flex-col h-[50%] mr-4 p-4 rounded-md items-center', !isReadOnly && current ? 'bg-primary' : 'bg-transparent')}>
            <Typography className={cn(current ? 'text-white' : 'text-primary')} variant="xs">
                {DateTime.fromISO(date).setLocale('de').toFormat('ccc')}.
            </Typography>
            <Typography className={cn('font-bold', current ? 'text-white' : 'text-primary')}>
                {DateTime.fromISO(date).setLocale('de').toFormat('dd.MM.')}
            </Typography>
        </div>
    );
};

export default AppointmentDate;
