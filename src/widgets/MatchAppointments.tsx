import { Box, Stack } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppointmentsEmptyState from './AppointmentsEmptyState';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentList from './AppointmentList';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { ScrollDirection } from '../pages/Appointments';

type MatchAppointmentsProps = {
    appointments: Appointment[];
    loading: boolean;
    minimumHeight: string;
    dissolved: boolean;
    loadMoreAppointments?: (skip: number, cursor: number, direction: ScrollDirection) => void;
    noNewAppointments?: boolean;
    noOldAppointments?: boolean;
    hasAppointments?: boolean;
    lastAppointmentId?: number | null;
};

const MatchAppointments: React.FC<MatchAppointmentsProps> = ({
    appointments,
    loading,
    minimumHeight,
    dissolved,
    loadMoreAppointments,
    noNewAppointments,
    noOldAppointments,
    hasAppointments,
    lastAppointmentId,
}) => {
    const { t } = useTranslation();

    return (
        <Stack minH={minimumHeight}>
            {hasAppointments ? (
                <AppointmentList
                    appointments={appointments as Appointment[]}
                    isLoadingAppointments={loading}
                    isReadOnlyList={dissolved}
                    isFullWidth={true}
                    loadMoreAppointments={loadMoreAppointments}
                    noNewAppointments={noNewAppointments}
                    noOldAppointments={noOldAppointments}
                    lastAppointmentId={lastAppointmentId}
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
