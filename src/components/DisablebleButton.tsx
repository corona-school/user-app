import { Button, Tooltip } from 'native-base';
import { PropsWithChildren, ComponentProps, ReactNode } from 'react';

type ButtonProps = ComponentProps<typeof Button>;

type DisablebleButtonProps = {
    isDisabled: boolean;
    reasonDisabled: string;
    buttonProps?: ButtonProps;
    disabledButtonContent?: ReactNode;
};

const DisablebleButton: React.FC<PropsWithChildren<DisablebleButtonProps>> = ({
    isDisabled,
    reasonDisabled,
    disabledButtonContent,
    children,
    ...buttonProps
}) => {
    return (
        <Tooltip maxW={300} label={reasonDisabled} isDisabled={!isDisabled}>
            <Button isDisabled={isDisabled} {...buttonProps}>
                {!isDisabled ? children : disabledButtonContent}
            </Button>
        </Tooltip>
    );
};

export default DisablebleButton;
