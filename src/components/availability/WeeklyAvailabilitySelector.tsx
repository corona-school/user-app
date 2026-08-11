import { WeeklyAvailability } from '@/gql/graphql';
import { cn } from '@/lib/Tailwind';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../Checkbox';
import { Day, DAYS, fromMinutesOfTheDayToFormat, TIME_SLOTS } from '@/Utility';
import { Skeleton } from '../Skeleton';
import { Button } from '../Button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useRef, useState } from 'react';

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
    const [hoveredRow, setHoveredRow] = useState('');
    const [hoveredColumn, setHoveredColumn] = useState('');

    const isCellSelected = (row: string, col: string) => {
        if (!availability) return false;
        return availability[col as Day]?.some(({ from, to }) => `${from}-${to}` === row);
    };

    const isCellHovered = (row: string, col: string) => {
        return hoveredColumn === col || hoveredRow === row;
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
            <div className="lg:hidden flex gap-x-2 justify-end mb-4">
                <Button onClick={() => handleOnScroll('start')} size="icon" variant="outline" className="rounded-full border-primary-lighter">
                    <IconChevronLeft />
                </Button>
                <Button onClick={() => handleOnScroll('end')} size="icon" variant="outline" className="rounded-full border-primary-lighter">
                    <IconChevronRight />
                </Button>
            </div>
            <div className="block overflow-x-hidden md:overflow-x-auto" ref={gridRef}>
                <div className="inline-grid grid-flow-col auto-cols-max lg:grid-cols-[100px] lg:auto-cols-[minmax(0,139px)] gap-x-2">
                    <div className="flex sticky left-0 flex-col gap-y-1 w-[100px]">
                        <div className="w-[100px] h-10 bg-white flex items-center justify-center text-subtle">{t('time')}</div>
                        {TIME_SLOTS.map((timeSlot) => (
                            <Skeleton key={timeSlot} isLoading={isLoading}>
                                <div
                                    onClick={() => handleRowClick(timeSlot)}
                                    onMouseEnter={() => setHoveredRow(timeSlot)}
                                    onMouseLeave={() => setHoveredRow('')}
                                    className={cn(
                                        'w-[100px] h-10 rounded-md text-center bg-primary-lighter text-primary transition-colors flex items-center justify-center cursor-pointer',
                                        { 'bg-green-200 text-green-800': isRowSelected(timeSlot) }
                                    )}
                                >
                                    <span className="text-subtle">{formatTimeSlot(timeSlot)}</span>
                                </div>
                            </Skeleton>
                        ))}
                    </div>

                    {DAYS.map((day) => (
                        <div key={day} className="flex flex-col gap-y-1 w-10 md:max-w-[139px] md:w-full">
                            <Skeleton isLoading={isLoading}>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleColumnClick(day)}
                                    onMouseEnter={() => setHoveredColumn(day)}
                                    onMouseLeave={() => setHoveredColumn('')}
                                    className={cn(
                                        'h-10 rounded-md text-center bg-primary-lighter transition-colors flex items-center justify-center text-primary px-4',
                                        {
                                            'bg-green-200 text-green-800': isColumnSelected(day),
                                        }
                                    )}
                                >
                                    <span className="hidden md:inline text-subtle">{weekdaysLabels[day]}</span>
                                    <span className="inline md:hidden text-subtle">{weekdaysLabels[day].substring(0, 2)}</span>
                                </div>
                            </Skeleton>

                            {TIME_SLOTS.map((timeSlot) => (
                                <Skeleton key={`schedule-cell-${day}-${timeSlot}`} isLoading={isLoading}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleCellClick(timeSlot, day)}
                                        className={cn('h-10 rounded-md transition-colors flex items-center justify-center group')}
                                    >
                                        <Checkbox
                                            checked={isCellSelected(timeSlot, day)}
                                            className={cn('size-4 data-[state=checked]:bg-green-500', {
                                                'border-transparent': isCellSelected(timeSlot, day),
                                                'border-primary group-hover:bg-green-200': !isCellSelected(timeSlot, day),
                                                'bg-green-200': isCellHovered(timeSlot, day),
                                            })}
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
