import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { MatchRequestStep } from '@/components/match-request/MatchRequestStep';
import { Typography } from '@/components/Typography';
import { createPupilScreeningLink } from '@/helper/screening-helper';
import { useUser } from '@/hooks/useApollo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { IconCalendar, IconInfoCircleFilled, IconTimeDuration10, IconAlertTriangleFilled, IconBulbFilled } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { PopupModal, useCalendlyEventListener } from 'react-calendly';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';

export const BookScreeningAppointment = () => {
    const { firstname, lastname, email } = useUser();
    const [isCalendarLoading, setIsCalendarLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { t } = useTranslation();
    const { goBack, goNext, refetch, isRefetching, createMatchRequest, form } = useMatchRequestForm();
    const [shouldFetchScreeningAppointment, setShouldFetchScreeningAppointment] = useLocalStorage({
        key: 'shouldFetchScreeningAppointment',
        initialValue: false,
    });
    const [refetchAttempts, setRefetchAttempts] = useState(0);

    useCalendlyEventListener({
        onEventScheduled: async (e) => {
            setShouldFetchScreeningAppointment(true);
            if (e.data.payload.event && !form.isAppointmentStepForced) {
                await createMatchRequest();
            }
        },
        onEventTypeViewed: () => {
            setIsCalendarLoading(false);
        },
    });

    useEffect(() => {
        setIsCalendarOpen(false);
        if (!shouldFetchScreeningAppointment) return;

        if (form?.screeningAppointment) {
            setShouldFetchScreeningAppointment(false);
            goNext();
            return;
        }

        if (refetchAttempts >= 5) {
            setShouldFetchScreeningAppointment(false);
            return;
        }

        const timeout = setTimeout(() => {
            refetch();
            setRefetchAttempts((prev) => prev + 1);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [shouldFetchScreeningAppointment, refetchAttempts, form?.screeningAppointment]);

    const isLoading = shouldFetchScreeningAppointment || isRefetching;

    const aboutTheAppointmentPoints = t('matching.wizard.pupil.bookScreeningAppointment.aboutTheAppointment.bullets', { returnObjects: true });
    const importantPoints = t('matching.wizard.pupil.bookScreeningAppointment.importantForAppointment.bullets', { returnObjects: true });

    return (
        <MatchRequestStep onBack={goBack} onCancel={() => {}} className="pb-0" isBackDisabled={isLoading}>
            <div className="relative h-full">
                <Typography variant="h4">{t('matching.wizard.pupil.bookScreeningAppointment.title')}</Typography>
                <div className="flex flex-col gap-y-9">
                    <div className="flex gap-x-4 items-center mt-9 w-full">
                        <Typography className="max-w-[680px]">{t('matching.wizard.pupil.bookScreeningAppointment.description')}</Typography>
                    </div>
                    <Alert icon={<IconTimeDuration10 />} variant="success-outline" className="w-full max-w-[560px]">
                        {t('matching.wizard.pupil.bookScreeningAppointment.alert', { minutes: 10 })}
                    </Alert>
                </div>
                <div className="flex flex-col lg:flex-row mt-4 gap-x-4 gap-y-8 mb-8">
                    <div className="w-full pt-5 pb-11 px-4 rounded-md border border-solid border-primary-light flex gap-x-6">
                        <div className="bg-primary-lighter size-12 flex justify-center items-center rounded-md mb-3">
                            <IconInfoCircleFilled size={24} />
                        </div>
                        <div>
                            <Typography className="font-semibold">{t('matching.wizard.pupil.bookScreeningAppointment.aboutTheAppointment.title')}</Typography>
                            <ul className="list-disc list-inside mt-4 text-pretty">
                                {aboutTheAppointmentPoints.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="w-full pt-5 pb-11 px-4 rounded-md border border-solid border-primary-light flex gap-x-6">
                        <div className="bg-primary-lighter size-12 flex justify-center items-center rounded-md mb-3">
                            <IconAlertTriangleFilled size={24} />
                        </div>
                        <div>
                            <Typography className="font-semibold">
                                {t('matching.wizard.pupil.bookScreeningAppointment.importantForAppointment.title')}
                            </Typography>
                            <ul className="list-disc list-inside mt-4 text-pretty">
                                {importantPoints.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="w-full pt-5 pb-6 px-4 rounded-md border border-solid border-primary-light flex gap-x-6">
                    <div className="bg-primary-lighter size-12 flex justify-center items-center rounded-md mb-3">
                        <IconBulbFilled size={24} />
                    </div>
                    <div>
                        <Typography className="font-semibold">{t('matching.wizard.pupil.bookScreeningAppointment.reminder.title')}</Typography>
                        <Typography>{t('matching.wizard.pupil.bookScreeningAppointment.reminder.description')}</Typography>
                    </div>
                </div>
                <Button
                    isLoading={isLoading}
                    leftIcon={<IconCalendar size={20} />}
                    onClick={() => setIsCalendarOpen(true)}
                    className="rounded-full shadow-lg py-6 px-4 absolute -bottom-20 right-0"
                >
                    {t('matching.wizard.pupil.bookScreeningAppointment.bookAppointment')}
                </Button>
                <PopupModal
                    rootElement={document.getElementById('root') as HTMLElement}
                    url={createPupilScreeningLink({
                        isFirstScreening: false,
                        firstName: firstname,
                        lastName: lastname,
                        email: email,
                    })}
                    open={isCalendarOpen}
                    onModalClose={() => setIsCalendarOpen(false)}
                    pageSettings={{ primaryColor: '#2A4A50', textColor: '#000000' }}
                    prefill={{ name: `${firstname} ${lastname}` }}
                    LoadingSpinner={() => (
                        <div className="absolute inset-0 flex">
                            <CenterLoadingSpinner />
                        </div>
                    )}
                />
            </div>
        </MatchRequestStep>
    );
};
