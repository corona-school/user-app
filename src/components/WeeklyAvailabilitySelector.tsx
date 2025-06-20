import { WeeklyAvailability } from '@/gql/graphql';
import { cn } from '@/lib/Tailwind';
import { useTranslation } from 'react-i18next';
import { Checkbox } from './Checkbox';
import { Day, DAYS, TIME_SLOTS } from '@/Utility';
import { Skeleton } from './Skeleton';

interface WeeklyAvailabilityProps {
    availability?: WeeklyAvailability;
    onChange: (availability: WeeklyAvailability) => void;
    isLoading?: boolean;
}

const fromTimeSlotToValues = (timeSlot: string) => {
    const [from, to] = timeSlot.split('-');
    return { from, to };
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
        const { from, to } = fromTimeSlotToValues(timeSlot);
        return t('appointment.clock.startToEnd', { start: from.split(':')[0], end: to.split(':')[0] });
    };

    return (
        <div className="bg-background">
            <div className="inline-block overflow-hidden">
                {/* Header row with weekdays */}
                <div className="grid grid-cols-8 bg-white gap-1 mb-1">
                    {/* Empty corner cell */}
                    <div className="p-3 bg-white"></div>
                    {DAYS.map((day) => (
                        <Skeleton key={day} loading={isLoading}>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => handleColumnClick(day)}
                                className={'p-3 rounded-md text-center transition-colors flex items-center justify-center gap-1 text-primary'}
                            >
                                <span>{weekdaysLabels[day]}</span>
                                <Checkbox checked={isColumnSelected(day)} className={cn('size-4', isColumnSelected(day) ? 'bg-primary' : 'bg-white')} />
                            </div>
                        </Skeleton>
                    ))}
                </div>

                {/* Time slots and cells */}
                <div className="flex flex-col gap-1">
                    {TIME_SLOTS.map((timeSlot) => (
                        <div key={`time-slot-${timeSlot}`} className="grid grid-cols-8 gap-1">
                            {/* Time slot header */}
                            <Skeleton key={timeSlot} loading={isLoading}>
                                <div
                                    onClick={() => handleRowClick(timeSlot)}
                                    className={cn(
                                        'p-3 rounded-md text-center bg-primary-lighter text-primary transition-colors flex items-center justify-center gap-1',
                                        isRowSelected(timeSlot) ? 'bg-primary text-white' : ''
                                    )}
                                >
                                    <Checkbox
                                        checked={isRowSelected(timeSlot)}
                                        className={cn('size-4', isRowSelected(timeSlot) ? 'border-white' : 'border-primary')}
                                    />
                                </div>
                            </Skeleton>
                            {/* Schedule cells */}
                            {DAYS.map((day) => (
                                <Skeleton key={`schedule-cell-${timeSlot}-${day}`} loading={isLoading}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        key={`${timeSlot}-${day}`}
                                        onClick={() => handleCellClick(timeSlot, day)}
                                        className={cn(
                                            'p-3 rounded-md text-center bg-primary-lighter text-primary transition-colors',
                                            isCellSelected(timeSlot, day) ? 'bg-primary text-white' : ''
                                        )}
                                    >
                                        {formatTimeSlot(timeSlot)}
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
