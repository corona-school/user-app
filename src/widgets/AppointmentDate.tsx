import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type Props = {
    current: boolean;
    date: string;
    color?: string;
    isReadOnly?: boolean;
    className?: string;
};

const AppointmentDate: React.FC<Props> = ({ current, date, color, className, isReadOnly = false }) => {
    const { i18n } = useTranslation();
    return (
        <div className={cn('flex flex-col h-[50%] mr-4 p-4 rounded-md items-center', !isReadOnly && current ? 'bg-primary' : 'bg-transparent', className)}>
            <Typography className={cn(current ? 'text-white' : 'text-primary')} variant="sm">
                {DateTime.fromISO(date).setLocale(i18n.language).toFormat('cccc')}
            </Typography>
            <Typography className={cn('font-bold', current ? 'text-white' : 'text-primary')} variant="lg">
                {DateTime.fromISO(date).setLocale(i18n.language).toFormat('d.M.')}
            </Typography>
        </div>
    );
};

export default AppointmentDate;
