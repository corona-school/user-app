import { Box, Divider, FormControl, Stack, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import AppointmentDate from '../../widgets/appointment/AppointmentDate';
import InputSuffix from '../../widgets/InputSuffix';
import AddNew from '../../widgets/AddNew';
import FurtherAppointment from './FurtherAppointment';

type WeeklyProps = {
    length: number;
};
const RepeatWeekly: React.FC<WeeklyProps> = ({ length }) => {
    const { t } = useTranslation();

    return (
        <Box w="70vw">
            <Stack space={3} direction="row" width="full">
                <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} />
                <VStack space={3} width="full">
                    <FormControl>
                        <InputSuffix appointmentLength={length} />
                        <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>{t('appointment.create.emptyFieldError')}</FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl>
                        <TextArea placeholder={t('appointment.create.descriptionLabel')} autoCompleteType={'normal'} />
                    </FormControl>
                </VStack>
            </Stack>

            <FurtherAppointment length={length} />
            <AddNew length={length} />
        </Box>
    );
};

export default RepeatWeekly;
