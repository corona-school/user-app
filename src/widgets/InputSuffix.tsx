import { Input, InputGroup, InputLeftAddon, Text } from 'native-base';

const InputSuffix: React.FC = () => {
    return (
        <>
            <InputGroup width="full">
                <InputLeftAddon borderColor="primary.100">
                    <Text>Lektion #1</Text>
                </InputLeftAddon>
                <Input borderBottomRightRadius={5} borderTopRightRadius={5} placeholder="Thema XYZ" />
            </InputGroup>
        </>
    );
};

export default InputSuffix;
