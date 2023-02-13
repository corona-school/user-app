import { Box, Button, Stack, useBreakpointValue } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AppointmentList from '../../widgets/appointment/AppointmentList';

type Props = {
    next: () => void;
    back: () => void;
};

const AppointmentsInsight: React.FC<Props> = ({ next, back }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '25%',
    });
    return (
        <Box>
            <Box maxH={maxHeight} flex="1" mb="10">
                <AppointmentList isStatic={true} />
            </Box>
            <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3}>
                <Button onPress={next} width={buttonWidth}>
                    {t('appointment.create.addAppointmentButton')}
                </Button>
                <Button variant="outline" onPress={back} width={buttonWidth}>
                    {t('appointment.create.backButton')}
                </Button>
            </Stack>
        </Box>
    );
};

export default AppointmentsInsight;
