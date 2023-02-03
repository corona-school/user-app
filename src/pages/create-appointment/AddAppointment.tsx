import { Box, Button, Checkbox, Stack, useBreakpointValue } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import RepeatWeekly from './RepeatWeekly';
import Form from './Form';
import { useCreateAppointments } from '../../hooks/useCreateAppointment';

type AddProps = {
    next: () => void;
    back: () => void;
};

const AddAppointment: React.FC<AddProps> = ({ next, back }) => {
    const [weekly, setWeekly] = useState<boolean>(false);
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const { newAppointment } = useCreateAppointments();

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '20%',
    });

    const handleCreateAppointment = () => {
        // TODO mutation with newAppointments
        console.log('create appointment/s', newAppointment);
    };

    return (
        <Box>
            <Form />
            <Box py="8">
                <Checkbox _checked={{ backgroundColor: 'danger.900' }} value="weekly" onChange={() => setWeekly(!weekly)}>
                    {t('appointment.create.weeklyRepeat')}
                </Checkbox>
            </Box>
            {weekly && <RepeatWeekly length={5} />}
            <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3} my="3">
                <Button onPress={handleCreateAppointment} width={buttonWidth}>
                    {t('appointment.create.addAppointmentButton')}
                </Button>
                <Button variant="outline" onPress={back} _text={{ padding: '3px 5px' }} width={buttonWidth}>
                    {t('appointment.create.backButton')}
                </Button>
            </Stack>
        </Box>
    );
};

export default AddAppointment;
