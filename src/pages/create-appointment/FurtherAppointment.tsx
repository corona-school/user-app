import { Divider, FormControl, HStack, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import AppointmentDate from '../../widgets/appointment/AppointmentDate';
import InputSuffix from '../../widgets/InputSuffix';
import RemoveIcon from '../../assets/icons/lernfair/remove_circle_outline.svg';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { useCreateAppointments } from '../../hooks/useCreateAppointment';

type WeeklyProps = {
    length: number;
};
const FurtherAppointment: React.FC<WeeklyProps> = ({ length }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const { newAppointment, setNewAppoinment } = useCreateAppointments();

    const handleInput = (e: any) => {
        setNewAppoinment({ ...newAppointment, weekly: [{ title: e.target.value }] });
    };
    return (
        <HStack space={3}>
            <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} />
            <VStack space={3} width={isMobile ? '75%' : '45%'}>
                <FormControl>
                    <InputSuffix appointmentLength={length + 1} handleInput={handleInput} />
                    <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>{t('appointment.create.emptyFieldError')}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl>
                    <TextArea
                        placeholder={t('appointment.create.descriptionLabel')}
                        autoCompleteType={'normal'}
                        onChangeText={(e) => setNewAppoinment({ ...newAppointment, weekly: [{ description: e }] })}
                    />
                </FormControl>
            </VStack>
            <Divider orientation="vertical" />
            <Pressable onPress={() => console.log('remove last weekly appointment')}>
                <RemoveIcon />
            </Pressable>
        </HStack>
    );
};

export default FurtherAppointment;
