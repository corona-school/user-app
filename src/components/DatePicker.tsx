import { DateTime } from 'luxon';
import { InputHTMLAttributes, useMemo } from 'react';
import '../web/scss/components/DatePicker.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    useMin?: boolean;
}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value, useMin = true }) => {
    const _min = useMemo(() => {
        let date = DateTime.now();
        date = date.plus({ days: 7 });
        return date.toFormat('yyyy-MM-dd');
    }, []);

    return (
        <>
            <div className="lf__datepicker">
                <input style={{ color: '#82B1B0' }} type={type} onChange={onChange} value={value} min={(type === 'date' && useMin && _min) || undefined} />
            </div>
        </>
    );
};
export default DatePicker;
