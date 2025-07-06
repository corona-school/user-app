import { WeeklyAvailability } from '@/gql/graphql';
import { cn } from '@/lib/Tailwind';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../Checkbox';
import { Day, DAYS, fromMinutesOfTheDayToFormat, TIME_SLOTS } from '@/Utility';
import { Skeleton } from '../Skeleton';
import { Button } from '../Button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useRef } from 'react';

interface WeeklyAvailabilityProps {
    availability?: WeeklyAvailability;
    onChange: (availability: WeeklyAvailability) => void;
    isLoading?: boolean;
}

export const fromTimeSlotToValues = (timeSlot: string) => {
    const [from, to] = timeSlot.split('-');
    return { from: Number(from), to: Number(to) };
};

export const WeeklyAvailabilitySelector = ({
    availability = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    },
    onChange,
    isLoading,
}: WeeklyAvailabilityProps) => {
    const { t } = useTranslation();
    const weekdaysLabels = t('weekdays', { returnObjects: true });

    const isCellSelected = (row: string, col: string) => {
        if (!availability) return false;
        return availability[col as Day]?.some(({ from, to }) => `${from}-${to}` === row);
    };

    const isColumnSelected = (col: Day) => {
        if (!availability) return false;
        return availability[col]?.length === TIME_SLOTS.length;
    };

    const isRowSelected = (row: string) => {
        if (!availability) return false;
        return Object.values(availability).every((slots) => slots.some((slot) => `${slot.from}-${slot.to}` === row));
    };

    const handleCellClick = (row: string, col: string) => {
        if (!availability) return;

        const { from, to } = fromTimeSlotToValues(row);
        const daySlots = availability[col as Day] || [];

        const wasSelected = daySlots.some((slot) => slot.from === from && slot.to === to);
        const newDaySlots = wasSelected ? daySlots.filter((slot) => !(slot.from === from && slot.to === to)) : [...daySlots, { from, to }];
        onChange({ ...availability, [col as Day]: newDaySlots });
    };

    const handleRowClick = (row: string) => {
        if (!availability) return;
        const { from, to } = fromTimeSlotToValues(row);
        const wasRowSelected = isRowSelected(row);
        const newAvailability = { ...availability };
        DAYS.forEach((day) => {
            const daySlots = newAvailability[day] ?? [];
            if (wasRowSelected) {
                newAvailability[day] = daySlots.filter((slot) => !(slot.from === from && slot.to === to));
            } else {
                const alreadyHasSlot = daySlots.some((slot) => slot.from === from && slot.to === to);
                newAvailability[day] = alreadyHasSlot ? daySlots : daySlots.concat({ from, to });
            }
        });

        onChange(newAvailability);
    };

    const handleColumnClick = (col: Day) => {
        if (!availability) return;
        const newDaySlots = isColumnSelected(col) ? [] : [...TIME_SLOTS.map((slot) => fromTimeSlotToValues(slot))];
        onChange({ ...availability, [col]: newDaySlots });
    };

    const formatTimeSlot = (timeSlot: string) => {
        if (!timeSlot) return '';

        const { from, to } = fromTimeSlotToValues(timeSlot);
        return t('appointment.clock.startToEndShort', { start: fromMinutesOfTheDayToFormat(from, 'HH'), end: fromMinutesOfTheDayToFormat(to, 'HH') });
    };

    const gridRef = useRef<HTMLDivElement>(null);
    const handleOnScroll = (to: 'start' | 'end') => {
        gridRef.current?.scrollTo({ behavior: 'smooth', left: to === 'start' ? 0 : gridRef.current.scrollWidth });
    };

    return (
        <div className="bg-background overflow-x-hidden">
            <div className="md:hidden flex gap-x-2 justify-end mb-4">
                <Button onClick={() => handleOnScroll('start')} size="icon" variant="outline" className="rounded-full border-primary-lighter">
                    <IconChevronLeft />
                </Button>
                <Button onClick={() => handleOnScroll('end')} size="icon" variant="outline" className="rounded-full border-primary-lighter">
                    <IconChevronRight />
                </Button>
            </div>
            <div className="block overflow-x-scroll" ref={gridRef}>
                {/* Header row with weekdays */}
                <div className="grid grid-cols-[100px_repeat(7,40px)] bg-white gap-y-1 gap-x-2 mb-1">
                    {/* Empty corner cell */}
                    <div className="w-[100px] h-10 bg-white flex items-center justify-center">{t('time')}</div>
                    {DAYS.map((day) => (
                        <Skeleton key={day} isLoading={isLoading}>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => handleColumnClick(day)}
                                className={cn(
                                    'size-10 rounded-md text-center bg-primary-lighter transition-colors flex items-center justify-center gap-y-1 gap-x-2 text-primary',
                                    {
                                        'bg-green-200 text-green-800': isColumnSelected(day),
                                    }
                                )}
                            >
                                <span>{weekdaysLabels[day].substring(0, 2)}</span>
                            </div>
                        </Skeleton>
                    ))}
                </div>

                {/* Time slots and cells */}
                <div className="flex flex-col gap-y-1 gap-x-2">
                    {TIME_SLOTS.map((timeSlot) => (
                        <div key={`time-slot-${timeSlot}`} className="grid grid-cols-[100px_repeat(7,40px)] gap-y-1 gap-x-2">
                            {/* Time slot header */}
                            <Skeleton key={timeSlot} isLoading={isLoading}>
                                <div
                                    onClick={() => handleRowClick(timeSlot)}
                                    className={cn(
                                        'w-[100px] h-10 rounded-md text-center bg-primary-lighter text-primary transition-colors flex items-center justify-center gap-y-1 gap-x-2 cursor-pointer',
                                        { 'bg-green-200 text-green-800': isRowSelected(timeSlot) }
                                    )}
                                >
                                    {formatTimeSlot(timeSlot)}
                                </div>
                            </Skeleton>
                            {/* Schedule cells */}
                            {DAYS.map((day) => (
                                <Skeleton key={`schedule-cell-${timeSlot}-${day}`} isLoading={isLoading}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        key={`${timeSlot}-${day}`}
                                        onClick={() => handleCellClick(timeSlot, day)}
                                        className={cn('size-10 rounded-md transition-colors flex items-center justify-center group')}
                                    >
                                        <Checkbox
                                            checked={isCellSelected(timeSlot, day)}
                                            className={cn(
                                                'size-4 data-[state=checked]:bg-green-500',
                                                isCellSelected(timeSlot, day) ? 'border-transparent' : 'border-primary group-hover:bg-green-200'
                                            )}
                                            checkClasses={'size-3'}
                                        />
                                    </div>
                                </Skeleton>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
