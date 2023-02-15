import { Box, Button, Divider, Stack, useBreakpointValue } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AppointmentList from '../../widgets/appointment/AppointmentList';

type Props = {
    next: () => void;
    back: () => void;
};
const CreateCourseAppointments: React.FC<Props> = ({ next, back }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    return (
        <Box>
            <Box maxH={maxHeight} flex="1" mb="10">
                <AppointmentList isReadOnly={true} />
            </Box>

            <Button
                variant="outline"
                borderStyle="dashed"
                borderWidth="2"
                borderColor="primary.500"
                _text={{ color: 'primary.500' }}
                width="full"
                onPress={() => console.log('navigate to Terminerstellung')}
            >
                {t('course.appointments.addOtherAppointment')}
            </Button>
            <Divider my="5" />

            <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" justifyContent="center" space={3}>
                <Button onPress={next} width={buttonWidth}>
                    {t('course.appointments.check')}
                </Button>
                <Button variant="outline" onPress={back} width={buttonWidth}>
                    {t('course.appointments.prevPage')}
                </Button>
            </Stack>
        </Box>
    );
};

export default CreateCourseAppointments;
