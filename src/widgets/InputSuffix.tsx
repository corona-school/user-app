import { Box, Input, InputGroup, InputLeftAddon, Text } from 'native-base';
import { useTranslation } from 'react-i18next';

type InputProps = {
    appointmentLength: number;
};
const InputSuffix: React.FC<InputProps> = ({ appointmentLength }) => {
    const { t } = useTranslation();

    return (
        <Box width="full">
            <InputGroup width="full">
                <InputLeftAddon borderColor="primary.100">
                    <Text>{t('appointment.createAppointment.lecture') + ` #${appointmentLength + 1}`}</Text>
                </InputLeftAddon>
                <Input width="85%" borderBottomRightRadius={5} borderTopRightRadius={5} placeholder={t('appointment.createAppointment.inputPlaceholder')} />
            </InputGroup>
        </Box>
    );
};

export default InputSuffix;
