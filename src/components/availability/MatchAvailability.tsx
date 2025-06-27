import { DayAvailabilitySlot, WeeklyAvailability } from '@/gql/graphql';
import { cn } from '@/lib/Tailwind';
import { Day, DAYS, fromMinutesOfTheDayToFormat } from '@/Utility';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '../Skeleton';
import { Typography } from '../Typography';

interface MatchAvailabilityProps {
    matchAvailability?: WeeklyAvailability;
    isLoading?: boolean;
    onSlotClick?: (day: Day, slot: DayAvailabilitySlot) => void;
}

export const MatchAvailability = ({
    matchAvailability = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    },
    isLoading,
    onSlotClick,
}: MatchAvailabilityProps) => {
    const { t } = useTranslation();
    const weekdaysLabels = t('weekdays', { returnObjects: true });

    const [sharedSlotKeys, nonSharedSlotKeys] = useMemo(() => {
        const sharedKeys: Record<string, DayAvailabilitySlot> = {};
        const nonSharedKeys: Record<string, DayAvailabilitySlot> = {};
        if (!matchAvailability) return [sharedKeys, nonSharedKeys];

        Object.entries(matchAvailability).forEach(([day, daySlots]) => {
            daySlots.forEach((slot) => {
                if (slot.isShared) {
                    sharedKeys[`${day}:${slot.from}-${slot.to}`] = slot;
                } else {
                    nonSharedKeys[`${day}:${slot.from}-${slot.to}`] = slot;
                }
            });
        });

        return [sharedKeys, nonSharedKeys] as const;
    }, [matchAvailability]);

    const isCellHighlighted = (day: Day, slot: DayAvailabilitySlot) => {
        return !!sharedSlotKeys[`${day}:${slot.from}-${slot.to}`];
    };

    const formatTimeSlot = (slot: DayAvailabilitySlot) => {
        if (!slot) return '';

        const { from, to } = slot;
        return t('appointment.clock.startToEndShort', { start: fromMinutesOfTheDayToFormat(from, 'HH'), end: fromMinutesOfTheDayToFormat(to, 'HH') });
    };

    const fromSlotToKey = (slot: DayAvailabilitySlot) => {
        return `${slot.from}-${slot.to}`;
    };

    const sharedSlotsCount = Object.values(sharedSlotKeys).length;
    const nonSharedSlotsCount = Object.values(nonSharedSlotKeys).length;

    return (
        <div>
            <div className="flex flex-col gap-y-2 lg:flex-row lg:gap-x-8 mb-5">
                <div className="flex items-center gap-x-2">
                    <div className="size-[14px] border border-gray-300 bg-green-200 rounded-full"></div>{' '}
                    <Typography>{t('matching.availability.sharedTimeSlots', { count: sharedSlotsCount })}</Typography>
                </div>
                <div className="flex items-center gap-x-2">
                    <div className="size-[14px] border border-gray-300 bg-primary-lighter rounded-full"></div>{' '}
                    <Typography>{t('matching.availability.otherTimeSlots', { count: nonSharedSlotsCount })}</Typography>
                </div>
            </div>
            <div className="grid grid-cols-[repeat(3,100px)] md:grid-cols-[repeat(4,100px)] lg:grid-cols-[repeat(7,100px)] bg-white gap-y-1 gap-x-4 mb-1">
                {DAYS.map((day) => (
                    <Skeleton key={day} loading={isLoading}>
                        <div className="flex flex-col gap-y-1">
                            {/* Header row with weekdays */}
                            <div
                                className={cn(
                                    'h-10 w-full rounded-md text-center transition-colors flex items-center justify-center gap-y-1 gap-x-2 text-primary'
                                )}
                            >
                                <span>{weekdaysLabels[day]}</span>
                            </div>
                            {/* Slots cells */}
                            {matchAvailability[day].map((slot) => (
                                <Skeleton key={`schedule-cell-${fromSlotToKey(slot)}-${day}`} loading={isLoading}>
                                    <div
                                        onClick={() => onSlotClick && onSlotClick(day, slot)}
                                        className={cn(
                                            'w-[100px] h-10 rounded-md text-center bg-primary-lighter text-primary transition-colors flex items-center justify-center gap-y-1 gap-x-2 cursor-pointer',
                                            { 'bg-green-200 text-green-800': isCellHighlighted(day, slot) }
                                        )}
                                    >
                                        {formatTimeSlot(slot)}
                                    </div>
                                </Skeleton>
                            ))}
                        </div>
                    </Skeleton>
                ))}
            </div>
        </div>
    );
};
