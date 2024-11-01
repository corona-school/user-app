import { DayPicker, DropdownProps, Locale } from 'react-day-picker';
import { de, enUS, ar, tr, uk, ru } from 'react-day-picker/locale';
import { Button, buttonVariants } from '@/components/Button';
import { cn } from '@/lib/Tailwind';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp } from '@tabler/icons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMemo } from 'react';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const navButtonClasses = cn(buttonVariants({ variant: 'outline' }), 'h-7 w-7 bg-transparent p-0');

const CalendarDropdowns = ({ value, onChange, name, className, options, 'aria-label': ariaLabel }: DropdownProps) => {
    const handleChange = (value: string) => {
        const changeEvent = {
            target: {
                value,
            },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange?.(changeEvent);
    };

    return (
        <Select value={value?.toString()} onValueChange={handleChange}>
            <SelectTrigger className={cn('h-8 w-full', className)} name={name} aria-label={ariaLabel}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options?.map((option, childIdx: number) => (
                    <SelectItem key={`${option.value}-${childIdx}`} value={option.value?.toString() ?? ''}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const Calendar = ({ className, classNames, showOutsideDays = true, captionLayout = 'dropdown', ...props }: CalendarProps) => {
    const [language] = useLocalStorage({ key: 'lernfair-language', initialValue: 'de' });
    const locale = useMemo(() => {
        const locales: Record<string, Locale> = {
            de,
            en: enUS,
            tr,
            uk,
            ru,
            ar,
        };
        return locales[language];
    }, [language]);
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            captionLayout={captionLayout}
            className={cn('px-6 py-4', className)}
            classNames={{
                months: 'flex flex-col flex-row space-y-0',
                month: 'mt-5 min-h-[320px]',
                month_caption: 'flex justify-center items-center h-7',
                caption_label: 'text-sm font-medium',
                dropdowns: 'flex flex-row gap-x-2 w-full',
                dropdown: 'flex w-full flex-1',
                years_dropdown: 'max-w-[80px]',
                nav: 'flex items-center absolute h-min inset-x-0 top-[50%] mx-3',
                button_previous: cn(navButtonClasses, 'absolute -left-5 z-20 disabled:opacity-[0.2]'),
                button_next: cn(navButtonClasses, 'absolute -right-5 z-20 disabled:opacity-[0.2]'),
                month_grid: 'w-full border-collapse mt-7',
                weekdays: 'flex',
                weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                week: 'flex w-full mt-2',
                day: cn(
                    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 aria-selected:bg-accent aria-selected:[&.day-outside]:bg-accent/50',
                    props.mode === 'range'
                        ? '[&.day-range-end]:rounded-r-md [&.day-range-start]:rounded-l-md aria-selected:[&.day-range-end]:rounded-r-md first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md'
                        : 'aria-selected:rounded-md'
                ),
                range_start: 'day-range-start',
                range_end: 'day-range-end',
                selected:
                    'bg-primary rounded-md text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                today: 'bg-accent rounded-md text-accent-foreground',
                outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                disabled: 'text-muted-foreground opacity-50',
                range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                hidden: 'invisible',
                ...classNames,
            }}
            components={{
                Dropdown: CalendarDropdowns,
                DayButton({ day, modifiers, className, ...buttonProps }) {
                    return (
                        <Button
                            ref={buttonProps.ref as any}
                            variant="ghost"
                            className={cn(
                                className,
                                'size-8 rounded-md p-0 font-normal',
                                modifiers?.today && 'bg-accent text-accent-foreground',
                                modifiers?.selected &&
                                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                                modifiers?.outside && 'text-muted-foreground opacity-50 pointer-events-none',
                                modifiers?.disabled && 'opacity-50 text-muted-foreground',
                                modifiers?.hidden && 'invisible',
                                modifiers.range_middle &&
                                    'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground rounded-none last:rounded-e-md first:rounded-s-md',
                                modifiers.outside && modifiers.selected && 'bg-accent/40 text-muted-foreground'
                            )}
                            {...buttonProps}
                            aria-selected={modifiers.selected || buttonProps['aria-selected']}
                            aria-disabled={modifiers.disabled || buttonProps['aria-disabled']}
                            aria-hidden={modifiers.hidden || buttonProps['aria-hidden']}
                        />
                    );
                },
                Chevron: (props) => {
                    switch (props.orientation) {
                        case 'left':
                            return <IconChevronLeft className="size-4" />;
                        case 'right':
                            return <IconChevronRight className="size-4" />;
                        case 'down':
                            return <IconChevronDown className="size-4" />;
                        case 'up':
                            return <IconChevronUp className="size-4" />;
                        default:
                            break;
                    }
                },
            }}
            {...props}
            locale={locale}
        />
    );
};
export { Calendar };
