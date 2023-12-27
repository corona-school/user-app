import { Button, Tooltip } from 'native-base';
import { PropsWithChildren, ComponentProps, ReactNode } from 'react';

type ButtonProps = ComponentProps<typeof Button>;

type DisableableButtonProps = {
    isDisabled: boolean;
    reasonDisabled: string;
    disabledButtonContent?: ReactNode;
} & ButtonProps;

const DisableableButton: React.FC<PropsWithChildren<DisableableButtonProps>> = ({ isDisabled, reasonDisabled, disabledButtonContent, children, ...rest }) => {
    return (
        <Tooltip maxW={300} label={reasonDisabled} isDisabled={!isDisabled} _text={{ textAlign: 'center' }}>
            <Button isDisabled={isDisabled} {...rest}>
                {(isDisabled && disabledButtonContent) || children}
            </Button>
        </Tooltip>
    );
};

export default DisableableButton;
