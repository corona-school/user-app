import { Box, Button, Divider, ScrollView, Stack, useBreakpointValue } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import { appointmentsData } from '../../widgets/appointment/dummy/testdata';

type Props = {
    next: () => void;
    back: () => void;
};

const CourseAppointments: React.FC<Props> = ({ next, back }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { isMobile } = useLayoutHelper();

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    // TODO query course appointments by ID
    return (
        <Box>
            <Box maxH={maxHeight} flex="1" mb="10">
                <AppointmentList isReadOnly={true} appointments={appointmentsData} />
            </Box>

            <Button
                variant="outline"
                borderStyle="dashed"
                borderWidth="2"
                borderColor="primary.500"
                _text={{ color: 'primary.500' }}
                width="full"
                onPress={() => navigate('/create-course-appointment')}
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

export default CourseAppointments;
