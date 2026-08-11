import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { Typography } from '@/components/Typography';
import { WeeklyAvailabilitySelector } from '@/components/availability/WeeklyAvailabilitySelector';
import WithNavigation from '@/components/WithNavigation';
import { gql } from '@/gql';
import { CalendarPreferences } from '@/gql/graphql';
import { logError } from '@/log';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const GET_CALENDAR_PREFERENCES_QUERY = gql(`
    query GetCalendarPreferences {
        me {
            calendarPreferences
        }
    }
`);

const UPDATE_CALENDAR_PREFERENCES_MUTATION = gql(`
    mutation UpdateCalendarPreferences($calendarPreferences: CalendarPreferences!) {
        meUpdate(update:  {
            calendarPreferences: $calendarPreferences
        })
    }
`);

const CalendarPreferencesPage = () => {
    const [calendarPreferences, setCalendarPreferences] = useState<CalendarPreferences>();
    const { data, loading } = useQuery(GET_CALENDAR_PREFERENCES_QUERY);
    const [updateCalendarPreferences, { loading: updating }] = useMutation(UPDATE_CALENDAR_PREFERENCES_MUTATION);
    const { t } = useTranslation();

    useEffect(() => {
        if (!loading && data) {
            setCalendarPreferences(data?.me?.calendarPreferences);
        }
    }, [data, loading]);

    const handleOnSave = async () => {
        if (!calendarPreferences) {
            return;
        }
        try {
            await updateCalendarPreferences({
                variables: {
                    calendarPreferences: calendarPreferences,
                },
            });
            toast.success(t('changesWereSaved'));
        } catch (error: any) {
            toast.error(t('error'));
            logError('calendarPreferences', error?.message, error);
        }
    };

    const selectedAvailabilityCount = calendarPreferences?.weeklyAvailability
        ? Object.values(calendarPreferences.weeklyAvailability).reduce((acc, slots) => acc + slots.length, 0)
        : 0;

    const getIsNextDisabled = () => {
        if (selectedAvailabilityCount < 3) {
            return { is: true, reason: t('matching.wizard.profile.availabilityMissing', { missing: 3 - selectedAvailabilityCount }) };
        }
        return { is: false, reason: '' };
    };

    return (
        <WithNavigation
            previousFallbackRoute="/settings"
            headerLeft={
                <div className="flex items-center flex-row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </div>
            }
        >
            <Breadcrumb />
            <Typography variant="h4" className="mb-5">
                {t('navigation.label.calendarPreferences')}
            </Typography>
            <div className="md:w-fit">
                <WeeklyAvailabilitySelector
                    onChange={(weeklyAvailability) => setCalendarPreferences({ weeklyAvailability })}
                    availability={calendarPreferences?.weeklyAvailability}
                    isLoading={loading}
                />
                <div className="mt-4">
                    <Button
                        onClick={handleOnSave}
                        isLoading={updating}
                        disabled={loading || !calendarPreferences || getIsNextDisabled().is}
                        reasonDisabled={getIsNextDisabled().reason}
                        className="w-full md:w-[165px] md:block md:ml-auto"
                    >
                        {t('done')}!
                    </Button>
                    <div className="flex flex-col gap-y-2 self-center mt-2 md:mt-0">
                        <Typography className="text-subtle">
                            {selectedAvailabilityCount >= 3 ? (
                                <span>
                                    <span className="mr-1">✅</span>{' '}
                                    {t('matching.wizard.profile.availabilitySelected', { selected: selectedAvailabilityCount })}
                                </span>
                            ) : (
                                <span>
                                    <span className="mr-1">⚠️</span>{' '}
                                    {t('matching.wizard.profile.availabilityMissing', { missing: Math.max(3 - selectedAvailabilityCount, 0) })}
                                </span>
                            )}
                        </Typography>
                    </div>
                </div>
            </div>
        </WithNavigation>
    );
};

export default CalendarPreferencesPage;
