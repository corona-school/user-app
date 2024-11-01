import { Button } from '@/components/Button';
import { Calendar } from '@/components/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { cn } from '@/lib/Tailwind';
import { IconCalendar } from '@tabler/icons-react';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { OnSelectHandler, PropsBase, PropsSingle } from 'react-day-picker';

type DatePickerProps = PropsBase &
    Omit<PropsSingle, 'selected' | 'mode' | 'onSelect'> & {
        value?: Date;
        onChange?: PropsSingle['onSelect'];
    };

const defaultSettings = {
    disabledBefore: new Date(),
    start: new Date(),
    end: DateTime.now().plus({ years: 2 }).toJSDate(),
};

export const DatePicker = ({
    startMonth = defaultSettings.start,
    endMonth = defaultSettings.end,
    disabled = { before: defaultSettings.disabledBefore },
    onChange,
    value,
}: DatePickerProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleOnSelect: OnSelectHandler<Date> = (...args) => {
        setIsOpen(false);
        if (onChange) {
            onChange(...args);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="input"
                    size="input"
                    className={cn('w-full', !value && 'text-muted-foreground')}
                    rightIcon={<IconCalendar className="h-4 w-4 opacity-50" />}
                >
                    {value ? DateTime.fromJSDate(value).toLocaleString(DateTime.DATE_SHORT, { locale: 'de' }) : t('datepickerPlaceholder')}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-5 w-auto" align="start">
                <div className="w-min relative">
                    <Calendar
                        selected={value}
                        showOutsideDays={false}
                        mode="single"
                        startMonth={startMonth}
                        defaultMonth={value}
                        endMonth={endMonth}
                        required
                        onSelect={handleOnSelect}
                        disabled={disabled}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};
