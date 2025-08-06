import { InfoTooltipButton } from '@/components/Tooltip';
import { useState } from 'react';
import { DateTime } from 'luxon';
import useInterval from '@/hooks/useInterval';
import { Label } from '@/components/Label';
import { useTranslation } from 'react-i18next';

const currentTimeToShow = () => {
    let date = DateTime.now();
    let time = date.setZone('Europe/Berlin').toFormat('HH:mm');
    return time;
};

const AddTimeWithTooltip: React.FC = ({}) => {
    const { t } = useTranslation();

    const [currentTime, setCurrentTimeToShow] = useState(currentTimeToShow());

    useInterval(() => {
        setCurrentTimeToShow(currentTimeToShow());
    }, 30_000);

    return (
        <div className="flex flex-col gap-y-1">
            <Label htmlFor="time">{t('appointment.create.timeLabel')}</Label>
            <div className="flex flex-row gap-x-1">
                <Label htmlFor="time">{t('appointment.create.timeLabel')}</Label>
                <InfoTooltipButton tooltipContent={t('appointment.create.toolTipTimeLabel', { currentTime })} />
            </div>
        </div>
    );
};

export default AddTimeWithTooltip;
