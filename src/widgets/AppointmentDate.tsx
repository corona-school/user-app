import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type Props = {
    current: boolean;
    date: string;
    color?: string;
    isReadOnly?: boolean;
};

const AppointmentDate: React.FC<Props> = ({ current, date, color, isReadOnly = false }) => {
    const { i18n } = useTranslation();
    return (
        <div className={cn('flex flex-col h-[50%] mr-4 p-4 rounded-md items-center', !isReadOnly && current ? 'bg-primary' : 'bg-transparent')}>
            <Typography className={cn(current ? 'text-white' : 'text-primary')} variant="xs">
                {DateTime.fromISO(date).setLocale(i18n.language).toFormat('ccc')}.
            </Typography>
            <Typography className={cn('font-bold', current ? 'text-white' : 'text-primary')}>
                {DateTime.fromISO(date).setLocale(i18n.language).toFormat('dd.MM.')}
            </Typography>
        </div>
    );
};

export default AppointmentDate;
