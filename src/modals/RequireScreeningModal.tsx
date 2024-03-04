import { Button, Flex, HStack, Heading, Spacer, Text, VStack, useTheme } from 'native-base';
import EventIcon from '../assets/icons/Icon_Einzel.svg';
import TimeIcon from '../assets/icons/lernfair/lf-timer.svg';
import LokiIcon from '../assets/icons/lernfair/avatar_pupil_120.svg';

import { useTranslation } from 'react-i18next';
import { gql } from '../gql';
import { useQuery } from '@apollo/client';
import useApollo from '../hooks/useApollo';
import { useEffect, useState } from 'react';
import { ContactSupportModal } from './ContactSupportModal';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

const EXISTING_SCREENINGS_QUERY = gql(`  
    query ExistingScreenings {
        me {
            pupil {
                grade
                subjectsFormatted { name }

                screenings { status }
            }
        }
    }
`);

export function RequireScreeningModal() {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const [contactSupport, setContactSupport] = useState(false);
    const { logout, user } = useApollo();

    const { data } = useQuery(EXISTING_SCREENINGS_QUERY);

    const wasScreened = data?.me.pupil?.screenings.some((it) => it.status === 'dispute');
    const wasRejected = data?.me.pupil?.screenings.some((it) => it.status === 'rejection');

    const calendlyLink =
        process.env.REACT_APP_PUPIL_FIRST_SCREENING_URL +
        '?first_name=' +
        encodeURIComponent(user?.firstname ?? '') +
        '&last_name=' +
        encodeURIComponent(user?.lastname ?? '') +
        '&email=' +
        encodeURIComponent(user?.email ?? '') +
        '&a1=' +
        encodeURIComponent(data?.me.pupil!.grade ?? '') +
        '&a2=' +
        encodeURIComponent(data?.me.pupil!.subjectsFormatted.map((it) => it.name).join(', ') ?? '');

    return (
        <Flex p={space['2']} flex="1" alignItems="center" justifyContent="center" bgColor="primary.900">
            <ContactSupportModal isOpen={contactSupport} onClose={() => setContactSupport(false)} />
            <HStack width="100%" space={space['1']}>
                <Spacer />
                <Button variant="outlinelight" onPress={() => setContactSupport(true)}>
                    {t('requireScreening.contactSupport')}
                </Button>
                <Button variant="outlinelight" onPress={logout}>
                    {t('logout')}
                </Button>
            </HStack>
            {!data && <CenterLoadingSpinner />}
            {data && !wasScreened && !wasRejected && (
                <VStack maxW={sizes['smallWidth']} space={space['1']} flex="1" alignItems="center">
                    <Spacer />
                    <EventIcon />
                    <Heading size="md" textAlign="center" color="lightText">
                        {t('requireScreening.noScreening.title', { firstname: user?.firstname })}
                    </Heading>
                    <Text color="lightText" textAlign="center">
                        {t('requireScreening.noScreening.content')}
                    </Text>
                    <Button
                        onPress={() => {
                            window.open(calendlyLink, '_blank');
                        }}
                    >
                        {t('requireScreening.noScreening.makeAppointment')}
                    </Button>
                    <Spacer />
                </VStack>
            )}
            {data && wasScreened && (
                <VStack maxW={sizes['smallWidth']} space={space['1']} flex="1" alignItems="center">
                    <Spacer />
                    <TimeIcon />
                    <Heading size="md" textAlign="center" color="lightText">
                        {t('requireScreening.hasScreening.title')}
                    </Heading>
                    <Text color="lightText" textAlign="center">
                        {t('requireScreening.hasScreening.content')}
                    </Text>
                    <Button
                        variant="ghost"
                        onPress={() => {
                            window.open(calendlyLink, '_blank');
                        }}
                    >
                        {t('requireScreening.hasScreening.makeAnotherAppointment')}
                    </Button>
                    <Spacer />
                </VStack>
            )}
            {data && wasRejected && (
                <VStack maxW={sizes['smallWidth']} space={space['1']} flex="1" alignItems="center">
                    <Spacer />
                    <LokiIcon />
                    <Heading size="md" textAlign="center" color="lightText">
                        {t('requireScreening.rejectedScreening.title', { firstname: user?.firstname })}
                    </Heading>
                    <Text color="lightText" textAlign="center">
                        {t('requireScreening.rejectedScreening.content')}
                    </Text>
                    <Spacer />
                </VStack>
            )}
        </Flex>
    );
}
