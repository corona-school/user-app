import { useBreakpointValue, useTheme, VStack } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import Hello from '../widgets/Hello';

const Appointments: React.FC = () => {
    const { space, sizes } = useTheme();
    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const { t } = useTranslation();

    return (
        <AsNavigationItem path="appointments">
            <WithNavigation headerContent={<Hello />} headerTitle={t('matching.group.pupil.header')} headerLeft={<NotificationAlert />}>
                <VStack maxWidth={ContainerWidth}>
                    <VStack>
                        <VStack maxWidth={'100%'} marginBottom={space['1']}>
                            Hello
                        </VStack>
                    </VStack>
                </VStack>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Appointments;
