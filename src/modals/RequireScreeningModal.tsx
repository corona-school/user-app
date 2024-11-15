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
import { useState } from 'react';
import { cn } from '@/lib/Tailwind';
import TruncatedText from '@/components/TruncatedText';

const EXISTING_SCREENINGS_QUERY = gql(`  
    query ExistingScreenings {
        me {
            pupil {
                grade
                subjectsFormatted { name }

                screenings { status }
            }
            student {
                tutorScreenings { success }
                instructorScreenings { success }
            }
        }
    }
`);

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

    const pupilScreenings = data?.me.pupil?.screenings ?? [];
    const needsPupilScreening = () => !pupilScreenings.length || pupilScreenings.some((e) => e.status === 'pending');
    const wasPupilRejected = () => !needsPupilScreening() && pupilScreenings.some((it) => it.status === 'rejection');
    const wasPupilScreened = () => !needsPupilScreening() && pupilScreenings.some((it) => it.status === 'dispute');

    const instructorScreenings = data?.me.student?.instructorScreenings ?? [];
    const tutorScreenings = data?.me.student?.tutorScreenings ?? [];
    const needsStudentScreening = () => !instructorScreenings.length && !tutorScreenings.length;
    const wasStudentRejected = () => {
        const rejectedForInstructor = instructorScreenings.some((e) => !e.success);
        const rejectedForTutor = tutorScreenings.some((e) => !e.success);
        return !needsStudentScreening() && (rejectedForInstructor || rejectedForTutor);
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
                {data && isPupil && wasPupilScreened() && (
                    <div className="flex flex-col max-w-96 gap-y-4 flex-1 items-center justify-center">
                        <TimeIcon className="size-16" />
                        <Typography variant="h4" className="text-center text-white">
                            {t('requireScreening.pupil.hasScreening.title')}
                        </Typography>
                        <Typography className="text-white text-center">{t('requireScreening.pupil.hasScreening.content')}</Typography>
                        <Button variant="ghost" onClick={() => window.open(calendlyLink, '_blank')}>
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
