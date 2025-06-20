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

const GET_CALENDAR_AVAILABILITY_QUERY = gql(`
    query GetCalendarAvailability {
        me {
            pupil {
                calendarPreferences
            }
        }
    }
`);

const UPDATE_CALENDAR_AVAILABILITY_MUTATION = gql(`
    mutation UpdateCalendarAvailability($calendarPreferences: CalendarPreferences!) {
        meUpdate(update:  {
            pupil: {
                calendarPreferences: $calendarPreferences
            }
        })
    }
`);

export const CalendarAvailabilityPage = () => {
    const [calendarPreferences, setCalendarPreferences] = useState<CalendarPreferences>();
    const { data, loading } = useQuery(GET_CALENDAR_AVAILABILITY_QUERY);
    const [updateCalendarAvailability, { loading: updating }] = useMutation(UPDATE_CALENDAR_AVAILABILITY_MUTATION);
    const { t } = useTranslation();

    useEffect(() => {
        if (!loading && data) {
            setCalendarPreferences(data?.me?.pupil?.calendarPreferences ?? {});
        }
    }, [data, loading]);

    const handleOnSave = async () => {
        if (!calendarPreferences) {
            return;
        }
        try {
            await updateCalendarAvailability({
                variables: {
                    calendarPreferences: calendarPreferences,
                },
            });
            toast.success(t('changesWereSaved'));
        } catch (error: any) {
            toast.error(t('error'));
            logError('calendarAvailability', error?.message, error);
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
                {t('navigation.label.calendarAvailability')}
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
