import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepDescription, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { IconCheck, IconVideo } from '@tabler/icons-react';
import AddToCalendarDropdown from '@/components/AddToCalendarDropdown';
import { useEffect } from 'react';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { DateTime } from 'luxon';
import i18next from 'i18next';
import Logo from '@/assets/icons/logo.svg';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';

interface ScreeningAppointmentDetailProps extends RegistrationStepProps {
    variant?: 'registered' | 'completed';
}

export const ScreeningAppointmentDetail = ({ onNext, variant = 'registered' }: ScreeningAppointmentDetailProps) => {
    const { form } = useRegistrationForm();
    const { t } = useTranslation();
    const pageTitles: Record<string, string> = {
        registered: `Registrierung: Termin bestätigt (${form.userType === 'pupil' ? 'Schüler:in' : 'Helfer:in'})`,
        completed: `Registrierung: Funnel abgeschlossen (${form.userType === 'pupil' ? 'Schüler:in' : 'Helfer:in'})`,
    };
    usePageTitle(pageTitles[variant]);
    const canStartMeeting = useCanJoinMeeting(5, form.screeningAppointment?.start!, form.screeningAppointment?.duration!);
    const { trackEvent } = useMatomo();

    useEffect(() => {
        const onFocus = () => {
            window.location.reload();
        };

        window.addEventListener('focus', onFocus);

        return () => {
            window.removeEventListener('focus', onFocus);
        };
    }, []);

    if (!form.screeningAppointment) {
        return <CenterLoadingSpinner />;
    }

    if (form.isWaitingScreeningResults) {
        return (
            <RegistrationStep>
                <Logo />
                <RegistrationStepTitle className="mb-4 mt-11">{t('registration.steps.screeningInProgress.title')}</RegistrationStepTitle>
                <Typography>{t('registration.steps.screeningInProgress.description')}</Typography>
            </RegistrationStep>
        );
    }

    const eventCategory = `${form.userType === 'pupil' ? 'SuS' : 'HuH'} Registration`;
    const eventAction = `Page "${variant === 'registered' ? 'Appointment confirmed' : 'Funnel completed'}"`;

    return (
        <RegistrationStep onNext={onNext}>
            {variant === 'registered' ? (
                <>
                    <div className="bg-green-500 rounded-full w-[100px] h-[100px] flex justify-center items-center mx-auto mb-5">
                        <IconCheck size={50} className="stroke-white !stroke-[2px]" />
                    </div>
                    <RegistrationStepTitle className="md:mb-5 mb-5">{t('registration.steps.appointmentDetails.title')}</RegistrationStepTitle>
                </>
            ) : (
                <div className="md:max-w-[440px] flex flex-col justify-center items-center mx-auto gap-y-4">
                    <RegistrationStepTitle className="md:mb-5 mb-5">{t('registration.steps.registrationCompleted.title')}</RegistrationStepTitle>
                    <div className="text-3xl">🥳</div>
                    <RegistrationStepDescription className="mb-5">{t('registration.steps.registrationCompleted.description')}</RegistrationStepDescription>
                </div>
            )}
            <Typography variant="h5" className="text-center mb-10 whitespace-pre-line text-balance">
                {DateTime.fromISO(form.screeningAppointment.start).toFormat('EEEE, dd. MMMM', { locale: i18next.language })} {'\n'}
                {DateTime.fromISO(form.screeningAppointment.start).toFormat('t', { locale: i18next.language })} {t('clock')}
            </Typography>
            {form.screeningAppointment && (
                <div className="flex flex-col gap-y-2 w-full lg:w-[306px]">
                    <AddToCalendarDropdown
                        buttonVariant="optional-dark"
                        buttonClasses="w-full lg:w-[306px]"
                        appointment={form.screeningAppointment}
                        onSelect={() => trackEvent({ category: eventCategory, action: eventAction, name: 'Button Click - Add to Calendar' })}
                    />
                    <Button
                        disabled={!form.screeningAppointment?.override_meeting_link || !canStartMeeting}
                        reasonDisabled={`${t('registration.steps.appointmentDetails.joinMeetingHint')}`}
                        onClick={() =>
                            form.screeningAppointment?.override_meeting_link && window.open(form.screeningAppointment?.override_meeting_link, '_blank')
                        }
                        leftIcon={<IconVideo />}
                        className="w-full lg:w-[306px]"
                    >
                        {t('registration.steps.appointmentDetails.joinCall')}
                    </Button>
                </div>
            )}
            <div className="flex gap-x-2 mt-4 mb-10 lg:max-w-[306px] w-full">
                <Button
                    variant="accent-dark"
                    shape="rounded"
                    className="w-full"
                    type="button"
                    onClick={() => {
                        trackEvent({ category: eventCategory, action: eventAction, name: 'Button Click - Edit Appointment' });
                        form.screeningAppointment?.actionUrls?.rescheduleUrl && window.open(form.screeningAppointment?.actionUrls.rescheduleUrl, '_blank');
                    }}
                >
                    {t('registration.steps.appointmentDetails.changeAppointment')}
                </Button>
                <Button
                    variant="accent-dark"
                    shape="rounded"
                    className="w-full"
                    type="button"
                    onClick={() => {
                        trackEvent({ category: eventCategory, action: eventAction, name: 'Button Click - Cancel Appointment' });
                        form.screeningAppointment?.actionUrls?.cancelUrl && window.open(form.screeningAppointment.actionUrls.cancelUrl, '_blank');
                    }}
                >
                    {t('registration.steps.appointmentDetails.cancelAppointment')}
                </Button>
            </div>
            {onNext && (
                <>
                    <RegistrationStepDescription className="mb-5">{t('registration.steps.appointmentDetails.description')}</RegistrationStepDescription>
                </>
            )}
        </RegistrationStep>
    );
};
