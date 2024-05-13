import { Button, Flex, HStack, Heading, Link, Spacer, Text, VStack, useTheme } from 'native-base';
import EventIcon from '../assets/icons/Icon_Einzel.svg';
import TimeIcon from '../assets/icons/lernfair/lf-timer.svg';
import LokiIcon from '../assets/icons/lernfair/avatar_pupil_120.svg';

import { useTranslation } from 'react-i18next';
import { gql } from '../gql';
import { useQuery } from '@apollo/client';
import useApollo, { useUserType } from '../hooks/useApollo';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import RequireScreeningSettingsDropdown from '../widgets/RequireScreeningSettingsDropdown';
import { asTranslationKey } from '../helper/string-helper';
import { createPupilScreeningLink, createStudentScreeningLink } from '../helper/screening-helper';

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
    const { space, sizes, colors } = useTheme();
    const { t } = useTranslation();
    const { user } = useApollo();
    const { data } = useQuery(EXISTING_SCREENINGS_QUERY);
    const userType = useUserType();
    const isPupil = userType === 'pupil';

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

    const needScreening = () => (isPupil ? needsPupilScreening() : needsStudentScreening());
    const wasRejected = () => (isPupil ? wasPupilRejected() : wasStudentRejected());

    return (
        <Flex p={space['2']} flex="1" alignItems="center" justifyContent="center" bgColor="primary.900">
            <HStack width="100%" space={space['1']} alignItems="center">
                <Spacer />
                <RequireScreeningSettingsDropdown />
            </HStack>
            {!data && <CenterLoadingSpinner />}
            {data && needScreening() && (
                <VStack maxW={sizes['smallWidth']} space={space['1']} flex="1" alignItems="center">
                    <Spacer />
                    <EventIcon />
                    <Heading size="md" textAlign="center" color="lightText">
                        {t(asTranslationKey(`requireScreening.${userType}.noScreening.title`), { firstname: user?.firstname })}
                    </Heading>
                    <Text color="lightText" textAlign="center">
                        {t(asTranslationKey(`requireScreening.${userType}.noScreening.content`))}
                    </Text>
                    <Button onPress={() => window.open(calendlyLink, '_blank')}>
                        {t(asTranslationKey(`requireScreening.${userType}.noScreening.makeAppointment`))}
                    </Button>
                    <Spacer />
                </VStack>
            )}
            {data && isPupil && wasPupilScreened() && (
                <VStack maxW={sizes['smallWidth']} space={space['1']} flex="1" alignItems="center">
                    <Spacer />
                    <TimeIcon />
                    <Heading size="md" textAlign="center" color="lightText">
                        {t('requireScreening.pupil.hasScreening.title')}
                    </Heading>
                    <Text color="lightText" textAlign="center">
                        {t('requireScreening.pupil.hasScreening.content')}
                    </Text>
                    <Button variant="ghost" onPress={() => window.open(calendlyLink, '_blank')}>
                        {t('requireScreening.pupil.hasScreening.makeAnotherAppointment')}
                    </Button>
                    <Spacer />
                </VStack>
            )}
            {data && wasRejected() && (
                <VStack maxW={sizes['smallWidth']} space={space['1']} flex="1" alignItems="center">
                    <Spacer />
                    <LokiIcon />
                    <Heading size="md" textAlign="center" color="lightText">
                        {t(asTranslationKey(`requireScreening.${userType}.rejectedScreening.title`), { firstname: user?.firstname })}
                    </Heading>
                    <Text color="lightText" textAlign="center">
                        {t(asTranslationKey(`requireScreening.${userType}.rejectedScreening.content`))}
                    </Text>
                    <Spacer />
                </VStack>
            )}
            <HStack space={space['1']}>
                <Text color={colors.white}>
                    <Link onPress={() => window.open('/datenschutz', '_blank')}>{t('settings.legal.datapolicy')}</Link>
                </Text>
                <Text color={colors.white}>
                    <Link onPress={() => window.open('/impressum', '_blank')}>{t('settings.legal.imprint')}</Link>
                </Text>
            </HStack>
        </Flex>
    );
}
