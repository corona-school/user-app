import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { Typography } from '@/components/Typography';
import { WeeklyAvailabilitySelector } from '@/components/WeeklyAvailabilitySelector';
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
            setCalendarPreferences(data?.me?.calendarPreferences ?? {});
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

    return (
        <WithNavigation
            previousFallbackRoute="/settings"
            headerTitle={t('sessionManager.title')}
            headerLeft={
                <div className="flex items-center flex-row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </div>
            }
        >
            <Breadcrumb />
            <Typography variant="h4" className="mb-2">
                {t('navigation.label.calendarPreferences')}
            </Typography>
            <div>
                <WeeklyAvailabilitySelector
                    onChange={(weeklyAvailability) => setCalendarPreferences({ weeklyAvailability })}
                    availability={calendarPreferences?.weeklyAvailability}
                    isLoading={loading}
                />
            </div>
            <Button onClick={handleOnSave} isLoading={updating} disabled={loading || !calendarPreferences} className="mt-4 md:w-[350px] w-full">
                {t('save')}
            </Button>
        </WithNavigation>
    );
};

export default CalendarPreferencesPage;
