import { Button, HStack, Input, useTheme } from 'native-base';
import AddIcon from '../assets/icons/ic_add_circle.svg';
import RemoveIcon from '../assets/icons/ic_remove_circle.svg';

type StepperProps = {
    value: number;
    increment: () => void;
    decrement: () => void;
};
const StepperInput: React.FC<StepperProps> = ({ value, increment, decrement }) => {
    const { space } = useTheme();

    return (
        <HStack space={space['0.5']}>
            <Button variant="outline" onPress={() => decrement()}>
                <RemoveIcon />
            </Button>
            <Input keyboardType="numeric" value={value.toString()} isReadOnly flex="auto" />
            <Button variant="outline" onPress={() => increment()}>
                <AddIcon />
            </Button>
        </HStack>
    );
};

export default StepperInput;
