import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import AddToCalendarDropdown from '@/components/AddToCalendarDropdown';
import { useEffect, useState } from 'react';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { DateTime } from 'luxon';
import i18next from 'i18next';

interface ScreeningAppointmentDetailProps extends RegistrationStepProps {
    variant?: 'registered' | 'completed';
}

export const ScreeningAppointmentDetail = ({ onNext, variant = 'registered' }: ScreeningAppointmentDetailProps) => {
    const { form } = useRegistrationForm();
    const { t } = useTranslation();
    const [shouldReload, setShouldReload] = useState(false);

    useEffect(() => {
        const onFocus = () => {
            if (!shouldReload) return;
            window.location.reload();
        };

        window.addEventListener('focus', onFocus);

        return () => {
            window.removeEventListener('focus', onFocus);
        };
    }, [shouldReload]);

    if (!form.screeningAppointment) {
        return <CenterLoadingSpinner />;
    }

    return (
        <RegistrationStep onNext={onNext}>
            {variant === 'registered' ? (
                <>
                    <IconCircleCheckFilled size={100} className="fill-green-500 mb-2" />
                    <RegistrationStepTitle className="md:mb-5 mb-5">{t('registration.steps.appointmentDetails.title')}</RegistrationStepTitle>
                </>
            ) : (
                <div className="md:max-w-[440px] flex flex-col justify-center items-center mx-auto gap-y-4">
                    <RegistrationStepTitle className="md:mb-5 mb-5">{t('registration.steps.registrationCompleted.title')}</RegistrationStepTitle>
                    <div className="text-3xl">🥳</div>
                    <Typography variant="body-lg" className="text-center mb-5">
                        {t('registration.steps.registrationCompleted.description')}
                    </Typography>
                </div>
            )}
            <Typography variant="h5" className="text-center mb-10 whitespace-pre-line text-balance">
                {DateTime.fromISO(form.screeningAppointment.start).toFormat('EEEE, dd. MMMM', { locale: i18next.language })} {'\n'}
                {DateTime.fromISO(form.screeningAppointment.start).toFormat('t', { locale: i18next.language })} {t('clock')}
            </Typography>
            {form.screeningAppointment && (
                <AddToCalendarDropdown buttonVariant="optional" buttonClasses="w-full lg:w-[306px]" appointment={form.screeningAppointment} />
            )}
            <div className="flex gap-x-2 mt-4 mb-10 lg:max-w-[306px] w-full">
                <Button
                    variant="accent-dark"
                    shape="rounded"
                    className="w-full"
                    onClick={() => {
                        setShouldReload(true);
                        form.screeningAppointment?.actionUrls?.rescheduleUrl && window.open(form.screeningAppointment?.actionUrls.rescheduleUrl, '_blank');
                    }}
                >
                    {t('registration.steps.appointmentDetails.changeAppointment')}
                </Button>
                <Button
                    variant="accent-dark"
                    shape="rounded"
                    className="w-full"
                    onClick={() => {
                        setShouldReload(true);
                        form.screeningAppointment?.actionUrls?.cancelUrl && window.open(form.screeningAppointment.actionUrls.cancelUrl, '_blank');
                    }}
                >
                    {t('registration.steps.appointmentDetails.cancelAppointment')}
                </Button>
            </div>
            {onNext && (
                <>
                    <Typography variant="body-lg" className="text-center mb-5">
                        {t('registration.steps.appointmentDetails.description')}
                    </Typography>
                </>
            )}
        </RegistrationStep>
    );
};
