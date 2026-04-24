import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { MatchRequestStep } from '@/components/match-request/MatchRequestStep';
import { Modal, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { createPupilScreeningLink } from '@/helper/screening-helper';
import { useUser } from '@/hooks/useApollo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { IconCalendar, IconInfoCircle, IconThumbUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { useMatchRequestForm } from './useMatchRequestForm';

export const BookScreeningAppointment = () => {
    const { firstname, lastname, email } = useUser();
    const [isCalendarLoading, setIsCalendarLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { goBack, goNext, refetch, isRefetching, createMatchRequest, form } = useMatchRequestForm();
    const [shouldFetchScreeningAppointment, setShouldFetchScreeningAppointment] = useLocalStorage({
        key: 'shouldFetchScreeningAppointment',
        initialValue: false,
    });
    const [refetchAttempts, setRefetchAttempts] = useState(0);

    useCalendlyEventListener({
        onEventScheduled: async (e) => {
            setShouldFetchScreeningAppointment(true);
            if (e.data.payload.event) {
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

    return (
        <MatchRequestStep onBack={goBack} onCancel={() => {}} className="pb-0" isBackDisabled={isLoading}>
            <div className="relative h-full">
                <Typography variant="h4">Kurzes Gespräch mit Lern-Fair</Typography>
                <div className="flex flex-col gap-y-9">
                    <div className="flex gap-x-4 items-center mt-9 w-full">
                        <div className="min-w-62px size-[62px] bg-slate-500 rounded-full" />
                        <Typography className="max-w-[680px]">
                            “Weil wir dich länger nicht mehr gesehen haben, wollen wir dich zu einem kurzen Gespräch einladen. Danach suchen wir einen neuen
                            Lernpartner für dich!”
                        </Typography>
                    </div>
                    <Alert icon={<IconThumbUp />} className="w-full max-w-[560px]">
                        Das Gespräch dauert nur 10 Minuten.
                    </Alert>
                </div>
                <div className="flex mt-4 gap-x-4 mb-8">
                    <div className="w-[370px] h-[310px] pt-5 pb-3 px-4 rounded-md border border-solid border-primary-light">
                        <div className="bg-primary-lighter size-12 flex justify-center items-center rounded-md mb-3">
                            <IconInfoCircle size={24} />
                        </div>
                        <Typography className="font-semibold">Darum geht es</Typography>
                        <ul className="list-disc list-inside mt-4 text-pretty">
                            <li>deine bisherigen Erfahrungen</li>
                            <li>deinen Lernfortschritt</li>
                            <li>wie wir sonst noch helfen können</li>
                        </ul>
                    </div>
                    <div className="w-[370px] h-[310px] pt-5 pb-3 px-4 rounded-md border border-solid border-primary-light">
                        <div className="bg-primary-lighter size-12 flex justify-center items-center rounded-md mb-3">
                            <IconInfoCircle size={24} />
                        </div>
                        <Typography className="font-semibold">Darum geht es</Typography>
                        <ul className="list-disc list-inside mt-4 text-pretty">
                            <li>deine bisherigen Erfahrungen</li>
                            <li>deinen Lernfortschritt</li>
                            <li>wie wir sonst noch helfen können</li>
                        </ul>
                    </div>
                    <div className="w-[370px] h-[310px] pt-5 pb-3 px-4 rounded-md border border-solid border-primary-light">
                        <div className="bg-primary-lighter size-12 flex justify-center items-center rounded-md mb-3">
                            <IconInfoCircle size={24} />
                        </div>
                        <Typography className="font-semibold">Darum geht es</Typography>
                        <ul className="list-disc list-inside mt-4 text-pretty">
                            <li>deine bisherigen Erfahrungen</li>
                            <li>deinen Lernfortschritt</li>
                            <li>wie wir sonst noch helfen können</li>
                        </ul>
                    </div>
                </div>
                <Button
                    isLoading={isLoading}
                    leftIcon={<IconCalendar size={20} />}
                    onClick={() => setIsCalendarOpen(true)}
                    className="rounded-full shadow-lg py-6 px-4 absolute -bottom-10 right-0"
                >
                    Gespräch vereinbaren
                </Button>
                <Modal
                    isOpen={isCalendarOpen}
                    onOpenChange={(open) => setIsCalendarOpen(open)}
                    className="p-0 bg-transparent w-[90%] h-full max-w-[90%] border-none shadow-none"
                    classes={{ closeIcon: 'text-white p-3 [&>svg]:h-6 [&>svg]:w-6' }}
                >
                    <ModalTitle className="sr-only">Kalender</ModalTitle>
                    {isCalendarLoading && (
                        <div className="absolute inset-0 flex">
                            <CenterLoadingSpinner className="text-white" />
                        </div>
                    )}
                    {!isLoading && (
                        <InlineWidget
                            url={createPupilScreeningLink({
                                isFirstScreening: false,
                                firstName: firstname,
                                lastName: lastname,
                                email: email,
                            })}
                            styles={{ width: '100%', height: '100%', opacity: isCalendarLoading ? 0 : 1 }}
                            pageSettings={{ primaryColor: '#2A4A50', textColor: '#000000' }}
                            prefill={{ name: `${firstname} ${lastname}` }}
                            LoadingSpinner={() => (
                                <div className="absolute inset-0 flex">
                                    <CenterLoadingSpinner />
                                </div>
                            )}
                        />
                    )}
                </Modal>
            </div>
        </MatchRequestStep>
    );
};
