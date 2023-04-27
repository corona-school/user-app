import { Box, Stack } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import AppointmentsEmptyState from '../widgets/AppointmentsEmptyState';
import { gql } from './../gql';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentList from '../widgets/appointment/AppointmentList';

const GET_MATCH_APPOINTMENTS = gql(`
query getMatchAppointments($id: Int!) {
    match(matchId: $id){
        appointments {
        id
            title
            description
            start
            duration
            appointmentType
            total
            position
            displayName
            isOrganizer
            isParticipant
            organizers(skip: 0, take: 5) {
                id
                firstname
                lastname
            }
            participants(skip: 0, take: 10) {
                id
                firstname
                lastname
                isPupil
                isStudent
            }
        }
    }
}
`);

export type ScrollDirection = 'next' | 'last';

const MatchAppointments: React.FC<{ matchId: number; minimumHeight: string }> = ({ matchId, minimumHeight }) => {
    const { t } = useTranslation();

    const {
        data: matchAppointments,
        loading: loadingMyAppointments,
        error,
    } = useQuery(GET_MATCH_APPOINTMENTS, {
        variables: {
            id: matchId,
        },
    });

    const appointments = matchAppointments?.match?.appointments ?? [];

    return (
        <Stack minHeight={minimumHeight}>
            {!error && appointments.length > 0 ? (
                <AppointmentList
                    appointments={appointments as Appointment[]}
                    isLoadingAppointments={loadingMyAppointments}
                    isReadOnlyList={true}
                    isFullWidth={true}
                />
            ) : (
                <Box justifyContent="center">
                    <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.noAppointmentsDesc')} />
                </Box>
            )}
        </Stack>
    );
};

export default MatchAppointments;
