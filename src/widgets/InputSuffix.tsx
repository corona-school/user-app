import { Input, InputGroup, InputLeftAddon, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../hooks/useLayoutHelper';

type InputProps = {
    appointmentLength: number;
    handleInput?: (e: any) => void;
};

const InputSuffix: React.FC<InputProps> = ({ appointmentLength, handleInput }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    return (
        <InputGroup>
            <InputLeftAddon borderColor="primary.100" width={isMobile ? '30%' : '25%'} alignItems="start">
                <Text>{t('appointment.create.lecture') + ` #${appointmentLength + 1}`}</Text>
            </InputLeftAddon>
            <Input
                name="title"
                width={isMobile ? '70%' : '75%'}
                onChange={handleInput}
                borderBottomRightRadius={5}
                borderTopRightRadius={5}
                placeholder={t('appointment.create.inputPlaceholder')}
            />
        </InputGroup>
    );
};

export default InputSuffix;
