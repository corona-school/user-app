import { Divider, FormControl, Stack, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import AppointmentDate from '../../widgets/appointment/AppointmentDate';
import InputSuffix from '../../widgets/InputSuffix';
import RemoveIcon from '../../assets/icons/lernfair/remove_circle_outline.svg';

type WeeklyProps = {
    length: number;
};
const FurtherAppointment: React.FC<WeeklyProps> = ({ length }) => {
    const { t } = useTranslation();
    return (
        <Stack mt="5" space={3} direction="row" width="full">
            <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} />
            <VStack space={3} width="95%">
                <FormControl>
                    <InputSuffix appointmentLength={length + 2} />
                    <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>{t('appointment.create.emptyFieldError')}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl>
                    <TextArea placeholder={t('appointment.create.descriptionLabel')} autoCompleteType={'normal'} />
                </FormControl>
            </VStack>
            <Divider orientation="vertical" />
            <Pressable onPress={() => console.log('remove appointment')}>
                <RemoveIcon />
            </Pressable>
        </Stack>
    );
};

export default FurtherAppointment;
