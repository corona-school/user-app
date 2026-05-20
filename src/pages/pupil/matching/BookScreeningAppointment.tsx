import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { MatchRequestStep } from '@/components/match-request/MatchRequestStep';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { createPupilScreeningLink } from '@/helper/screening-helper';
import { useUser } from '@/hooks/useApollo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { IconCalendar, IconTimeDuration10, IconCircleChevronDown, IconArrowLeft } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { PopupModal, useCalendlyEventListener } from 'react-calendly';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMatchRequestForm } from './useMatchRequestForm';

export const BookScreeningAppointment = () => {
    const { firstname, lastname, email } = useUser();
    const [isCalendarLoading, setIsCalendarLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
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

    const handleOnBack = () => {
        if (form.isAppointmentStepForced) {
            navigate(-1);
        } else {
            goBack();
        }
    };

    return (
        <MatchRequestStep className="pb-0">
            <div className="relative h-full">
                <Typography variant="h4">{t('matching.wizard.pupil.bookScreeningAppointment.title')}</Typography>
                <div className="flex flex-col gap-y-7 mb-4">
                    <div className="flex gap-x-4 items-center mt-7 w-full">
                        <Typography className="max-w-[680px]">{t('matching.wizard.pupil.bookScreeningAppointment.description')}</Typography>
                    </div>
                    <Alert icon={<IconTimeDuration10 />} variant="success-outline" className="w-full max-w-[368px]">
                        {t('matching.wizard.pupil.bookScreeningAppointment.alert', { minutes: 10 })}
                    </Alert>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Accordion type="single" collapsible className="w-full my-4 max-w-[845px] min-h-[350px]">
                        <AccordionItem className="border-none py-0" value={'about'}>
                            <AccordionTrigger IconComponent={IconCircleChevronDown} iconClasses="size-10 !stroke-[0.5px]" className="py-0 items-center">
                                <Typography variant="body-lg" className="font-medium">
                                    {t('matching.wizard.pupil.bookScreeningAppointment.aboutTheAppointment.title')}
                                </Typography>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col pt-2">
                                <ul className="list-disc list-inside text-pretty pl-3">
                                    {aboutTheAppointmentPoints.map((point, index) => (
                                        <li key={index}>
                                            <Typography variant="subtle" as="span">
                                                {point}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <Separator className="my-4 bg-primary-lighter" />
                        <AccordionItem className="border-none py-0" value={'important'}>
                            <AccordionTrigger IconComponent={IconCircleChevronDown} iconClasses="size-10 !stroke-[0.5px]" className="py-0 items-center">
                                <Typography variant="body-lg" className="font-medium">
                                    {t('matching.wizard.pupil.bookScreeningAppointment.importantForAppointment.title')}
                                </Typography>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col pt-2">
                                <ul className="list-disc list-inside text-pretty pl-3">
                                    {importantPoints.map((point, index) => (
                                        <li key={index}>
                                            <Typography variant="subtle" as="span">
                                                {point}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <Separator className="my-4 bg-primary-lighter" />
                        <AccordionItem className="border-none py-0" value={'reminder'}>
                            <AccordionTrigger IconComponent={IconCircleChevronDown} iconClasses="size-10 !stroke-[0.5px]" className="py-0 items-center">
                                <Typography variant="body-lg" className="font-medium">
                                    <Typography className="font-semibold">{t('matching.wizard.pupil.bookScreeningAppointment.reminder.title')}</Typography>
                                </Typography>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col pt-2">
                                <Typography variant="subtle">{t('matching.wizard.pupil.bookScreeningAppointment.reminder.description')}</Typography>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className="flex gap-x-4">
                    {!form.isAppointmentStepForced && (
                        <Button
                            leftIcon={<IconArrowLeft size={14} className="!stroke-[2px]" />}
                            className="min-w-[177px]"
                            variant="outline"
                            onClick={handleOnBack}
                            disabled={isLoading}
                        >
                            {t('back')}
                        </Button>
                    )}
                    <Button className="min-w-[177px]" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                        {t('cancel')}
                    </Button>
                    <Button
                        isLoading={isLoading}
                        leftIcon={<IconCalendar size={20} />}
                        onClick={() => setIsCalendarOpen(true)}
                        className="min-w-[177px] px-[43px]"
                    >
                        {t('matching.wizard.pupil.bookScreeningAppointment.bookAppointment')}
                    </Button>
                </div>
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
