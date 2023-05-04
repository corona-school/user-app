import { Spacer } from 'native-base';
import { InputHTMLAttributes, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '../web/scss/components/DatePicker.scss';
import { DateTime } from 'luxon';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    useMin?: boolean;
    isCourse?: boolean;
    isToday?: boolean;
}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value, useMin = true, onBlur, isCourse, isToday }) => {
    const { t } = useTranslation();

    const subcourseDateMin = useMemo(() => {
        let date = DateTime.now();
        if (isCourse) date = date.plus({ days: 7 });
        return date.toFormat('yyyy-MM-dd');
    }, [isCourse]);

    const matchTimeMin = useMemo(() => {
        let date = DateTime.now();
        if (!isCourse && isToday) {
            date = date.plus({ minutes: 5 });
            return date.toFormat('HH:mm');
        }
        return undefined;
    }, [isCourse, isToday]);

    const minVal = useMemo(() => {
        if (type === 'date' && useMin) return subcourseDateMin;
        if (type === 'time' && useMin) return matchTimeMin;
        return undefined;
    }, [matchTimeMin, subcourseDateMin, type, useMin]);
    return (
        <>
            <div className="lf__datepicker">
                <input
                    placeholder={type === 'date' ? t('datepickerPlaceholder') : t('timepickerPlaceholder')}
                    type={type}
                    onChange={onChange}
                    value={value}
                    min={minVal}
                    onBlur={onBlur}
                />
            </div>
            <Spacer m={3} />
        </>
    );
};
export default DatePicker;
