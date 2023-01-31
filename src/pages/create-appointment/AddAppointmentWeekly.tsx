import { Box, Divider, FormControl, Stack, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import AppointmentDate from '../../widgets/appointment/AppointmentDate';
import InputSuffix from '../../widgets/InputSuffix';
import RemoveIcon from '../../assets/icons/lernfair/remove_circle_outline.svg';

type WeeklyProps = {
    length: number;
};
const AddAppointmentWeekly: React.FC<WeeklyProps> = ({ length }) => {
    const { t } = useTranslation();
    return (
        <Box width="full" pt="3">
            <Stack space={3} direction="row" width="full">
                <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} />
                <VStack space={3} width="full">
                    <FormControl>
                        <InputSuffix appointmentLength={length + 1} />
                        <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                            {t('appointment.createAppointment.emptyFieldError')}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl>
                        <TextArea placeholder={t('appointment.createAppointment.descriptionLabel')} autoCompleteType={'normal'} />
                    </FormControl>
                </VStack>
            </Stack>

            <Stack mt="5" space={3} direction="row" width="80%">
                <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} />
                <VStack space={3} width="full">
                    <FormControl>
                        <InputSuffix appointmentLength={length + 2} />
                        <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                            {t('appointment.createAppointment.emptyFieldError')}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl>
                        <TextArea placeholder={t('appointment.createAppointment.descriptionLabel')} autoCompleteType={'normal'} />
                    </FormControl>
                </VStack>
                <Divider orientation="vertical" />
                <Pressable onPress={() => console.log('remove appointment')}>
                    <RemoveIcon />
                </Pressable>
            </Stack>

            <Stack mt="5" space={3} direction="row" width="80%">
                <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} />
                <VStack space={3} width="full">
                    <FormControl>
                        <InputSuffix appointmentLength={length + 3} />
                        <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                            {t('appointment.createAppointment.emptyFieldError')}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl>
                        <TextArea placeholder={t('appointment.createAppointment.descriptionLabel')} autoCompleteType={'normal'} />
                    </FormControl>
                </VStack>
            </Stack>
        </Box>
    );
};

export default AddAppointmentWeekly;
