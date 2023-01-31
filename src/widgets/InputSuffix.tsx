import { Input, InputGroup, InputLeftAddon, Text } from 'native-base';
import { useTranslation } from 'react-i18next';

const InputSuffix: React.FC = () => {
    const { t } = useTranslation();
    const appointments = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

    console.log(appointments.length);

    return (
        <>
            <InputGroup width="full">
                <InputLeftAddon borderColor="primary.100">
                    <Text>{t('appointment.createAppointment.lecture')} #1</Text>
                </InputLeftAddon>
                <Input borderBottomRightRadius={5} borderTopRightRadius={5} placeholder={t('appointment.createAppointment.inputPlaceholder')} />
            </InputGroup>
        </>
    );
};

export default InputSuffix;
