import { Box, Stack } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import AppointmentsEmptyState from '../widgets/AppointmentsEmptyState';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentList from '../widgets/appointment/AppointmentList';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

type MatchAppointmentsProps = {
    appointments: Appointment[];
    loading: boolean;
    error: ApolloError | undefined;
    minimumHeight: string;
    dissolved: boolean;
};

const MatchAppointments: React.FC<MatchAppointmentsProps> = ({ appointments, loading, error, minimumHeight, dissolved }) => {
    const { t } = useTranslation();

    return (
        <Stack minH={minimumHeight}>
            {loading && !appointments && <CenterLoadingSpinner />}
            {!error && appointments.length > 0 ? (
                <AppointmentList
                    appointments={appointments as Appointment[]}
                    isLoadingAppointments={loading}
                    isReadOnlyList={dissolved}
                    isFullWidth={true}
                    noOldAppointments
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
