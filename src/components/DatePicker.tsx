import { DateTime } from 'luxon';
import { Spacer } from 'native-base';
import { InputHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../web/scss/components/DatePicker.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    useMin?: boolean;
}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value, useMin = true }) => {
    const { t } = useTranslation();
    const _min = useMemo(() => {
        let date = DateTime.now();
        date = date.plus({ days: 7 });
        return date.toFormat('yyyy-MM-dd');
    }, []);

    return (
        <>
            <div className="lf__datepicker">
                <input
                    placeholder={type === 'date' ? t('datepickerPlaceholder') : t('timepickerPlaceholder')}
                    type={type}
                    onChange={onChange}
                    value={value}
                    min={(type === 'date' && useMin && _min) || undefined}
                />
            </div>
            <Spacer m={3} />
        </>
    );
};
export default DatePicker;
