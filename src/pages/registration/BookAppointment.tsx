import { Trans, useTranslation } from 'react-i18next';
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
    const { trackEvent, trackPageView } = useMatomo();
    const [timerId, setTimerId] = useState<NodeJS.Timer>();
    const isPupil = form.userType === 'pupil';
    usePageTitle(`Registrierung: Kennenlerngespräch buchen (${isPupil ? 'Schüler:in' : 'Helfer:in'})`);

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
            action: 'Page "Book Appointment"',
            name: 'Button Click - Book an appointment',
        });
    };

    const handleOnOpenFaqModal = () => {
        setIsFaqModalOpen(true);
        trackEvent({
            category: eventCategory,
            action: 'Page "Book Appointment"',
            name: 'Button Click - More Infos',
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
            trackPageView({
                documentTitle: `Registrierung: Termin auswählen (${form.userType === 'pupil' ? 'Schüler:in' : 'Helfer:in'})`,
            });
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
                {t(form.userType === 'pupil' ? 'registration.steps.bookAppointment.descriptionPupil' : 'registration.steps.bookAppointment.descriptionStudent')}
            </Typography>
            <div className="flex relative mb-5 mt-7">
                <img
                    src={form.userType === 'pupil' ? PortraitsPupilScreeners : PortraitsStudentScreeners}
                    alt="Lern-Fair Team"
                    className="h-[150px] md:h-[160px]"
                />
            </div>
            <Typography variant="body-lg" className="text-center mb-5 max-w-[495px]">
                <span className="font-semibold whitespace-pre text-wrap">
                    {t(form.userType === 'pupil' ? 'registration.steps.bookAppointment.messagePupil' : 'registration.steps.bookAppointment.messageStudent')}
                </span>
                <span className="block">{t('registration.steps.bookAppointment.lernFairTeam')}</span>
            </Typography>
            <div className="flex flex-col gap-y-5 w-full items-center justify-center">
                <Button variant="accent-dark" shape="rounded" onClick={handleOnOpenFaqModal}>
                    {t('moreInfos')}
                </Button>
                <Button className="min-w-[250px]" onClick={handleOnOpenCalendly}>
                    {t('registration.steps.bookAppointment.bookAppointmentButton')}
                </Button>
            </div>
            <Modal className="max-w-[800px] w-full border-none max-h-full overflow-y-auto" isOpen={isFaqModalOpen} onOpenChange={setIsFaqModalOpen}>
                <ModalHeader>
                    <DialogTitle className="sr-only">FAQ</DialogTitle>
                </ModalHeader>
                <div className="overflow-y-auto">
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
                                        <Typography>
                                            <Trans
                                                i18nKey={
                                                    `registration.steps.bookAppointment.${
                                                        form.userType === 'pupil' ? 'faqPupil' : 'faqStudent'
                                                    }.${index}.answer` as any
                                                }
                                                components={{
                                                    clarificationVideo: (
                                                        <a
                                                            target="_blank"
                                                            href={'https://drive.google.com/file/d/1TTaWphKiSw9C8j8J4TLko4cGXV-KrTEi/view'}
                                                            rel="noreferrer"
                                                            className="underline"
                                                            onClick={() => {
                                                                trackEvent({
                                                                    category: 'HuH Registration',
                                                                    action: 'Page "Book Appointment"',
                                                                    name: 'Link Click - Explanation Video',
                                                                });
                                                            }}
                                                        >
                                                            hier findest du ein Erklärvideo
                                                        </a>
                                                    ),
                                                    supportEmail: (
                                                        <a className="inline underline text-primary" href="mailto:support@lern-fair.de">
                                                            support@lern-fair.de
                                                        </a>
                                                    ),
                                                }}
                                            />
                                        </Typography>
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
