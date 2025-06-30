import EventIcon from '../assets/icons/Icon_Einzel.svg';
import TimeIcon from '../assets/icons/lernfair/lf-timer.svg';
import LokiIcon from '../assets/icons/lernfair/avatar_pupil.svg';

import { Trans, useTranslation } from 'react-i18next';
import { gql } from '../gql';
import { useQuery } from '@apollo/client';
import useApollo, { useUserType } from '../hooks/useApollo';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import RequireScreeningSettingsDropdown from '../widgets/RequireScreeningSettingsDropdown';
import { asTranslationKey } from '../helper/string-helper';
import { createPupilScreeningLink, createStudentScreeningLink } from '../helper/screening-helper';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { PublicFooter } from '@/components/PublicFooter';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/Tailwind';
import TruncatedText from '@/components/TruncatedText';
import { DateTime } from 'luxon';
import { IconEdit, IconTrash, IconVideo } from '@tabler/icons-react';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';

const EXISTING_SCREENINGS_QUERY = gql(`  
    query ExistingScreenings {
        me {
            pupil {
                grade
                subjectsFormatted { name }

                screenings {
                    status,
                    appointment {
                        start,
                        override_meeting_link,
                        duration,
                        actionUrls {
                            cancelUrl
                            rescheduleUrl
                        }
                    }
                }
            }
            student {
                tutorScreenings { status, appointment { start, override_meeting_link, duration, actionUrls { cancelUrl rescheduleUrl } } }
                instructorScreenings { status, appointment { start, override_meeting_link, duration, actionUrls { cancelUrl rescheduleUrl } } }
            }
        }
    }
`);

interface ScreeningAppointment {
    start?: string | null;
    override_meeting_link?: string | null;
    duration?: number | null;
    actionUrls?: {
        cancelUrl?: string | null;
        rescheduleUrl?: string | null;
    } | null;
}

export function RequireScreeningModal() {
    const { t } = useTranslation();
    const { user } = useApollo();
    const { data } = useQuery(EXISTING_SCREENINGS_QUERY);
    const userType = useUserType();
    const isPupil = userType === 'pupil';
    usePageTitle(`Lern-Fair - Registrierung: Termin vereinbaren für ${isPupil ? 'Schüler:innen' : 'Helfer:innen'}`);
    const { trackEvent } = useMatomo();
    const [showCalendar, setShowCalendar] = useState(false);
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
    const [shouldReload, setShouldReload] = useState(false);

    const pupilScreenings = data?.me.pupil?.screenings ?? [];
    const needsPupilScreening = () => !pupilScreenings.length || pupilScreenings.some((e) => e.status === 'pending' && !e.appointment);
    const wasPupilRejected = () => !needsPupilScreening() && pupilScreenings.some((it) => it.status === 'rejection');
    const wasPupilScreened = () => pupilScreenings.some((it) => it.status === 'dispute');
    const getPupilScreeningAppointment = () => {
        const currentBookedScreening = pupilScreenings.find((e) => ['pending', 'dispute'].includes(e.status));
        if (!currentBookedScreening?.appointment) return null;
        return currentBookedScreening.appointment;
    };

    const getStudentScreeningAppointment = () => {
        const bookedInstructorScreenings = instructorScreenings.find((e) => e.status === 'pending');
        const bookedTutorScreenings = tutorScreenings.find((e) => e.status === 'pending');

        if (bookedInstructorScreenings?.appointment) return bookedInstructorScreenings.appointment;
        if (bookedTutorScreenings?.appointment) return bookedTutorScreenings.appointment;
        return null;
    };

    const instructorScreenings = data?.me.student?.instructorScreenings ?? [];
    const tutorScreenings = data?.me.student?.tutorScreenings ?? [];
    const studentScreenings = [...instructorScreenings, ...tutorScreenings];
    const needsStudentScreening = () => !studentScreenings.length || studentScreenings.some((e) => e.status === 'pending' && !e.appointment);
    const wasStudentRejected = () => {
        const rejected = studentScreenings.some((e) => e.status === 'rejection');
        return !needsStudentScreening() && rejected;
    };

    const calendlyLink = isPupil
        ? createPupilScreeningLink({
              isFirstScreening: true,
              firstName: user?.firstname,
              lastName: user?.lastname,
              email: user?.email,
              grade: data?.me.pupil?.grade,
              subjects: data?.me.pupil?.subjectsFormatted,
          })
        : createStudentScreeningLink({
              firstName: user?.firstname,
              lastName: user?.lastname,
              email: user?.email,
          });

    const eventCategory = `${isPupil ? 'SuS' : 'HuH'} Registration`;

    const needScreening = () => (isPupil ? needsPupilScreening() : needsStudentScreening()) && !showCalendar;
    const wasRejected = () => (isPupil ? wasPupilRejected() : wasStudentRejected()) && !showCalendar;

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
        onEventScheduled: () => {
            trackEvent({
                category: eventCategory,
                action: 'Button Click',
                name: 'Termin bestätigt in Calendly Widget',
            });
        },
        onEventTypeViewed: () => {
            setIsLoadingCalendar(false);
        },
    });

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

    const currentBookedScreeningAppointment = isPupil ? getPupilScreeningAppointment() : getStudentScreeningAppointment();

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-primary p-4">
            <div className="flex w-full gap-2 items-center justify-end px-4 pt-2 z-50">
                <RequireScreeningSettingsDropdown />
            </div>
            <div
                className={cn(
                    'flex flex-col flex-1 w-full lg:max-w-2xl items-center justify-center gap-y-6 relative',
                    showCalendar && 'lg:max-w-full lg:-mt-16'
                )}
            >
                {!data && <CenterLoadingSpinner />}
                {data && showCalendar && (
                    <div className="h-full w-full mt-2 lg:mt-0 lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center ">
                        {isLoadingCalendar && (
                            <div className="absolute">
                                <CenterLoadingSpinner className="text-white" />
                            </div>
                        )}
                        <InlineWidget
                            pageSettings={{ primaryColor: '#2A4A50', textColor: '#000000' }}
                            prefill={{ name: `${user?.firstname} ${user?.lastname}` }}
                            styles={{ width: '100%', height: '100%', opacity: isLoadingCalendar ? 0 : 1 }}
                            url={calendlyLink}
                            iframeTitle={t(asTranslationKey(`requireScreening.${userType}.noScreening.title`), { firstname: user?.firstname })}
                        />
                    </div>
                )}
                {data && needScreening() && (
                    <div className="flex flex-col max-w-[450px] lg:max-w-[500px] gap-y-4 flex-1 items-center justify-center">
                        <EventIcon />
                        <Typography variant="h4" className="text-center text-white text-pretty">
                            {t(asTranslationKey(`requireScreening.${userType}.noScreening.title`), { firstname: user?.firstname })}
                        </Typography>
                        <div className="flex flex-col items-center justify-center">
                            <TruncatedText asChild buttonClasses="text-white" maxLines={4}>
                                <Typography className="text-white text-balance text-center whitespace-break-spaces">
                                    <Trans
                                        i18nKey={`requireScreening.${userType}.noScreening.content` as any}
                                        values={{
                                            firstname: user?.firstname,
                                            email: `<b>${user?.email}</b>`,
                                        }}
                                        components={{ b: <b /> }}
                                    />
                                </Typography>
                            </TruncatedText>
                        </div>
                        <Button variant="secondary" onClick={handleOnOpenCalendly}>
                            {t(asTranslationKey(`requireScreening.${userType}.noScreening.makeAppointment`))}
                        </Button>
                    </div>
                )}
                {data && !needScreening() && currentBookedScreeningAppointment && (
                    <AppointmentDetail appointment={currentBookedScreeningAppointment} onAction={() => setShouldReload(true)} />
                )}
                {data && isPupil && wasPupilScreened() && !showCalendar && !currentBookedScreeningAppointment && (
                    <div className="flex flex-col max-w-96 gap-y-4 flex-1 items-center justify-center">
                        <TimeIcon className="size-16" />
                        <Typography variant="h4" className="text-center text-white">
                            {t('requireScreening.pupil.hasScreening.title')}
                        </Typography>
                        <Typography className="text-white text-center">{t('requireScreening.pupil.hasScreening.content')}</Typography>
                        <Button variant="optional" onClick={() => setShowCalendar(true)}>
                            {t('requireScreening.pupil.hasScreening.makeAnotherAppointment')}
                        </Button>
                    </div>
                )}
                {data && wasRejected() && (
                    <div className="flex flex-col max-w-96 gap-y-4 flex-1 items-center justify-center">
                        <LokiIcon className="size-16" />
                        <Typography variant="h4" className="text-center text-white">
                            {t(asTranslationKey(`requireScreening.${userType}.rejectedScreening.title`), { firstname: user?.firstname })}
                        </Typography>
                        <Typography className="text-white text-center">
                            {t(asTranslationKey(`requireScreening.${userType}.rejectedScreening.content`))}
                        </Typography>
                    </div>
                )}
                {!showCalendar && (
                    <div className="mt-4">
                        <PublicFooter
                            helpText={data && isPupil && needScreening() ? t(asTranslationKey(`requireScreening.pupil.noScreening.footer`)) : undefined}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

const AppointmentDetail = ({ appointment, onAction }: { appointment: ScreeningAppointment; onAction: () => void }) => {
    const { t, i18n } = useTranslation();
    const canStartMeeting = useCanJoinMeeting(5, appointment.start!, appointment.duration!);
    return (
        <div className="flex flex-col max-w-[400px] w-full gap-y-10 flex-1 items-center justify-center">
            <Typography variant="h4" className="text-center text-white">
                {t('requireScreening.appointment.title')}
            </Typography>
            <Typography className="text-white text-center">
                {t('requireScreening.appointment.yourAppointment')}:
                <Typography className="text-white text-center" variant="h4">
                    {DateTime.fromISO(appointment.start!).toFormat('cccc dd. MMM, HH:mm', { locale: i18n.language })}
                </Typography>
            </Typography>
            <div className="flex flex-col gap-y-4">
                <Typography className="text-white text-center">{t('requireScreening.appointment.description')}</Typography>
                <Typography className="text-white text-center">{t('requireScreening.appointment.optionsDescription')}</Typography>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <Button
                    disabled={!appointment?.override_meeting_link || !canStartMeeting}
                    reasonDisabled={`${t('requireScreening.appointment.joinMeetingHint')}`}
                    onClick={() => appointment?.override_meeting_link && window.open(appointment?.override_meeting_link, '_blank')}
                    variant="secondary"
                    leftIcon={<IconVideo />}
                    className="w-full"
                >
                    {t('appointment.tile.videoButton')}
                </Button>
                <div className="flex gap-x-2">
                    <Button
                        variant="optional"
                        className="w-full"
                        leftIcon={<IconEdit />}
                        onClick={() => {
                            onAction();
                            appointment?.actionUrls?.rescheduleUrl && window.open(appointment.actionUrls.rescheduleUrl, '_blank');
                        }}
                    >
                        {t('requireScreening.appointment.changeAppointment')}
                    </Button>
                    <Button
                        variant="destructive"
                        className="w-full"
                        leftIcon={<IconTrash />}
                        onClick={() => {
                            onAction();
                            appointment?.actionUrls?.cancelUrl && window.open(appointment.actionUrls.cancelUrl, '_blank');
                        }}
                    >
                        {t('requireScreening.appointment.cancelAppointment')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
