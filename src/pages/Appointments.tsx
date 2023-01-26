import { useBreakpointValue, useTheme, VStack } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import AppointmentList from '../widgets/appointment/AppointmentList';
import FloatingActionButton from '../widgets/FloatingActionButton';
import Hello from '../widgets/Hello';

const Appointments: React.FC = () => {
    const navigate = useNavigate();
    const { space, sizes } = useTheme();
    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const fabPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'top-right',
    });
    const { t } = useTranslation();

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation headerContent={<Hello />} headerTitle={t('appointment.title')} headerLeft={<NotificationAlert />}>
                <FloatingActionButton handlePress={() => navigate('/create-appointment')} place={fabPlace} />
                <VStack maxWidth={ContainerWidth} marginBottom={space['1']}>
                    <AppointmentList />
                </VStack>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Appointments;
