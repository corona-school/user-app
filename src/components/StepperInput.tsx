import { AddIcon, MinusIcon, Button, HStack, Input, useTheme } from 'native-base';

type StepperProps = {
    value: number;
    increment: () => void;
    decrement: () => void;
    handleInputChange: (input: string) => void;
};
const StepperInput: React.FC<StepperProps> = ({ value, increment, decrement, handleInputChange }) => {
    const { space } = useTheme();

    return (
        <>
            <HStack space={space['0.5']}>
                <Button variant="outline" onPress={() => decrement()}>
                    <MinusIcon color="primary.500" />
                </Button>
                <Input
                    keyboardType="numeric"
                    value={value.toString()}
                    onChangeText={(input) => {
                        handleInputChange(input);
                    }}
                    isReadOnly
                />
                <Button variant="outline" onPress={() => increment()}>
                    <AddIcon color="primary.500" />
                </Button>
            </HStack>
        </>
    );
};

export default StepperInput;
