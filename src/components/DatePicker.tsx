import { Spacer } from 'native-base';
import { InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import '../web/scss/components/DatePicker.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value, min, onBlur }) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="lf__datepicker">
                <input
                    placeholder={type === 'date' ? t('datepickerPlaceholder') : t('timepickerPlaceholder')}
                    type={type}
                    onChange={onChange}
                    value={value}
                    min={min}
                    onBlur={onBlur}
                />
            </div>
            <Spacer m={3} />
        </>
    );
};
export default DatePicker;
