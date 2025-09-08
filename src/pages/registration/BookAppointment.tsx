import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Fragment, useEffect, useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { createPupilScreeningLink, createStudentScreeningLink } from '@/helper/screening-helper';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { asTranslationKey } from '@/helper/string-helper';
import { cn } from '@/lib/Tailwind';
import { Modal, ModalHeader } from '@/components/Modal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { Separator } from '@/components/Separator';
import { IconCircleChevronDown } from '@tabler/icons-react';
import { useRegistrationForm } from './useRegistrationForm';
import { DialogTitle } from '@radix-ui/react-dialog';
import PortraitsStudentScreeners from '@/assets/images/registration/portraits_huh.png';
import PortraitsPupilScreeners from '@/assets/images/registration/portraits_sus.png';

interface BookAppointmentProps extends RegistrationStepProps {}

export const BookAppointment = ({ onNext }: BookAppointmentProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
    const { t } = useTranslation();
    const { form, refetchProfile } = useRegistrationForm();
    const { trackEvent } = useMatomo();
    const [timerId, setTimerId] = useState<NodeJS.Timer>();
    const isPupil = form.userType === 'pupil';
    usePageTitle(`Lern-Fair - Registrierung: Termin vereinbaren für ${isPupil ? 'Schüler:innen' : 'Helfer:innen'}`);

    const calendlyLink = isPupil
        ? createPupilScreeningLink({
              isFirstScreening: true,
              firstName: form?.firstname,
              lastName: form?.lastname,
              email: form?.email,
          })
        : createStudentScreeningLink({
              firstName: form?.firstname,
              lastName: form?.lastname,
              email: form?.email,
          });

    const eventCategory = `${isPupil ? 'SuS' : 'HuH'} Registration`;

    const handleOnOpenCalendly = () => {
        setShowCalendar(true);
        trackEvent({
            category: eventCategory,
            action: 'Button Click',
            name: 'CTA TERMIN BUCHEN geklickt, und Calendly Widget geöffnet',
        });
    };

    useCalendlyEventListener({
        onDateAndTimeSelected: () => {
            trackEvent({
                category: eventCategory,
                action: 'Button Click',
                name: 'Termin ausgewählt in Calendly Widget',
            });
        },
        onEventScheduled: (e) => {
            trackEvent({
                category: eventCategory,
                action: 'Button Click',
                name: 'Termin bestätigt in Calendly Widget',
            });
            setIsLoadingCalendar(true);
            const id = setInterval(() => {
                refetchProfile();
                setIsLoadingCalendar(false);
            }, 2000);
            setTimerId(id);
        },
        onEventTypeViewed: () => {
            setIsLoadingCalendar(false);
        },
    });

    const currentBookedScreeningAppointment = form.screeningAppointment;

    useEffect(() => {
        if (currentBookedScreeningAppointment?.start && onNext) {
            clearInterval(timerId);
            onNext();
        }
        return () => clearInterval(timerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBookedScreeningAppointment?.start, timerId]);

    if (showCalendar) {
        return (
            <div className={cn('flex flex-col flex-1 w-full items-center justify-center gap-y-6 relative max-w-full')}>
                <div className="h-full w-full">
                    {isLoadingCalendar && (
                        <div className="absolute inset-0 flex">
                            <CenterLoadingSpinner />
                        </div>
                    )}
                    <InlineWidget
                        pageSettings={{ primaryColor: '#2A4A50', textColor: '#000000' }}
                        prefill={{ name: `${form?.firstname} ${form?.lastname}` }}
                        styles={{ width: '100%', height: '100%', opacity: isLoadingCalendar ? 0 : 1 }}
                        url={calendlyLink}
                        iframeTitle={t(asTranslationKey(`requireScreening.${form.userType}.noScreening.title`), { firstname: form?.firstname })}
                    />
                </div>
            </div>
        );
    }

    const faq = t(form.userType === 'pupil' ? 'registration.steps.bookAppointment.faqPupil' : 'registration.steps.bookAppointment.faqStudent', {
        returnObjects: true,
    });

    return (
        <RegistrationStep>
            <RegistrationStepTitle className="mb-4 md:mb-4">{t('registration.steps.bookAppointment.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center md:whitespace-pre-line text-balance">
                {t('registration.steps.bookAppointment.description')}
            </Typography>
            <div className="flex relative mb-5 mt-7">
                <img
                    src={form.userType === 'pupil' ? PortraitsPupilScreeners : PortraitsStudentScreeners}
                    alt="Lern-Fair Team"
                    className="h-[150px] md:h-[160px]"
                />
            </div>
            <Typography variant="body-lg" className="text-center mb-5">
                <span className="font-semibold">{t('registration.steps.bookAppointment.message')}</span>
                <span className="block">{t('registration.steps.bookAppointment.lernFairTeam')}</span>
            </Typography>
            <div className="flex flex-col gap-y-5 w-full items-center justify-center">
                <Button variant="accent-dark" shape="rounded" onClick={() => setIsFaqModalOpen(true)}>
                    {t('moreInfos')}
                </Button>
                <Button className="min-w-[250px]" onClick={handleOnOpenCalendly}>
                    {t('registration.steps.bookAppointment.bookAppointmentButton')}
                </Button>
            </div>
            <Modal className="max-w-[800px] w-full border-none" isOpen={isFaqModalOpen} onOpenChange={setIsFaqModalOpen}>
                <ModalHeader>
                    <DialogTitle className="sr-only">FAQ</DialogTitle>
                </ModalHeader>
                <div>
                    <Accordion type="single" collapsible className="w-full my-4">
                        {faq.map(({ question, answer }, index) => (
                            <Fragment key={question}>
                                {index > 0 && <Separator className="my-4 bg-primary-lighter" />}
                                <AccordionItem value={`question-${index}`} className="border-none py-0">
                                    <AccordionTrigger IconComponent={IconCircleChevronDown} iconClasses="size-10 !stroke-[0.5px]" className="py-0 items-center">
                                        <Typography variant="body-lg" className="font-medium">
                                            {question}
                                        </Typography>
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col pt-5">
                                        <Typography>{answer}</Typography>
                                    </AccordionContent>
                                </AccordionItem>
                            </Fragment>
                        ))}
                    </Accordion>
                    <Button className="mx-auto block w-auto" onClick={() => setIsFaqModalOpen(false)}>
                        {t('close')}
                    </Button>
                </div>
            </Modal>
        </RegistrationStep>
    );
};
