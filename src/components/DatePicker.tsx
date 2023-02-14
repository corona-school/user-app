import { DateTime } from 'luxon';
import { InputHTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../web/scss/components/DatePicker.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    useMin?: boolean;
}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value, useMin = true }) => {
    const [inputType, setInputType] = useState('text');
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
                    placeholder={type === 'date' ? t('input.datepickerPlaceholder') : t('input.timepickerPlaceholder')}
                    type={inputType}
                    onFocus={(e) => setInputType(type)}
                    onBlur={(e) => setInputType('text')}
                    onChange={onChange}
                    value={value}
                    min={(type === 'date' && useMin && _min) || undefined}
                />
            </div>
        </>
    );
};
export default DatePicker;
