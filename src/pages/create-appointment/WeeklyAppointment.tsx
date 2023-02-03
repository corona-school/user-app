import { FormControl, HStack, Stack, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AppointmentDate from '../../widgets/appointment/AppointmentDate';
import InputSuffix from '../../widgets/InputSuffix';

type WeeklyProps = {
    length: number;
};
const WeeklyAppointment: React.FC<WeeklyProps> = ({ length }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    return (
        <HStack space={3}>
            <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} />
            <VStack space={3} width={isMobile ? '90%' : '45%'}>
                <FormControl>
                    <InputSuffix appointmentLength={length} />
                    <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>{t('appointment.create.emptyFieldError')}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl>
                    <TextArea placeholder={t('appointment.create.descriptionLabel')} autoCompleteType={'normal'} />
                </FormControl>
            </VStack>
        </HStack>
    );
};

export default WeeklyAppointment;
