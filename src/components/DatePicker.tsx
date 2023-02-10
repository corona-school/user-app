import { DateTime } from 'luxon';
import { InputHTMLAttributes, useMemo, useState } from 'react';
import '../web/scss/components/DatePicker.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    useMin?: boolean;
}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value, useMin = true }) => {
    // TODO add state to handle type
    const [inputType, setInputType] = useState('text');
    const _min = useMemo(() => {
        let date = DateTime.now();
        date = date.plus({ days: 7 });
        return date.toFormat('yyyy-MM-dd');
    }, []);

    return (
        <>
            <div className="lf__datepicker">
                <input
                    placeholder={type === 'date' ? 'Wähle ein Datum...' : '00:00'}
                    type={inputType}
                    onFocus={(e) => setInputType(type)} // change to type in props
                    onBlur={(e) => setInputType('text')} // change back to text
                    onChange={onChange}
                    value={value}
                    min={(type === 'date' && useMin && _min) || undefined}
                />
            </div>
        </>
    );
};
export default DatePicker;
