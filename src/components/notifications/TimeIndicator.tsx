import { useState } from 'react';
import useInterval from '../../hooks/useInterval';
import { useTranslation } from 'react-i18next';
import { getTimeText } from '../../helper/notification-helper';
import { Typography } from '../Typography';

type TimeIndicatorProps = {
    sentAt: string;
};

const TimeIndicator = ({ sentAt }: TimeIndicatorProps) => {
    const { t } = useTranslation();
    const [toggleRerender, setToggleRerender] = useState<boolean>(false);
    const time = getTimeText(sentAt);

    useInterval(() => {
        setToggleRerender(!toggleRerender);
    }, 60_000);

    return (
        <div className="max-w-[80px] pr-3">
            <Typography variant="xs" className="text-end">
                {typeof time === 'string' ? time : t(time.text, time?.options)}
            </Typography>
        </div>
    );
};

export default TimeIndicator;
