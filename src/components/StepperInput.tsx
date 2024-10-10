import { IconCircleMinus, IconCirclePlus } from '@tabler/icons-react';
import { Input } from 'native-base';
import { Button } from './Button';

type StepperProps = {
    value: number;
    increment: () => void;
    decrement: () => void;
};
const StepperInput = ({ value, increment, decrement }: StepperProps) => {
    return (
        <div className="flex gap-x-2">
            <Button variant="outline" size="icon" onClick={() => decrement()}>
                <IconCircleMinus />
            </Button>
            <Input keyboardType="numeric" value={value.toString()} isReadOnly flex="auto" h="40px" />
            <Button variant="outline" size="icon" onClick={() => increment()}>
                <IconCirclePlus />
            </Button>
        </div>
    );
};

export default StepperInput;
