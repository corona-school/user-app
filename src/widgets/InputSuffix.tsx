import { Input, InputGroup, InputLeftAddon, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../hooks/useLayoutHelper';

type InputProps = {
    appointmentsCount: number;
    inputValue?: string;
    handleInput?: (e: any) => void;
    handleBlur?: (e: any) => void;
};

const InputSuffix: React.FC<InputProps> = ({ appointmentsCount, inputValue, handleInput, handleBlur }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    return (
        <InputGroup>
            <InputLeftAddon borderColor="primary.100" width={isMobile ? '40%' : '25%'} alignItems="start">
                <Text>{t('appointment.create.lecture') + ` #${appointmentsCount}`}</Text>
            </InputLeftAddon>
            <Input
                name="title"
                width={isMobile ? '60%' : '75%'}
                onChange={handleInput}
                borderBottomRightRadius={5}
                borderTopRightRadius={5}
                placeholder={t('appointment.create.inputPlaceholder')}
                _light={{ placeholderTextColor: 'primary.500' }}
                value={inputValue}
                onBlur={handleBlur}
            />
        </InputGroup>
    );
};

export default InputSuffix;
