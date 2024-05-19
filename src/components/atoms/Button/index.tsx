import { ReactNode } from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps, Tooltip } from '@chakra-ui/react';

interface ButtonProps extends ChakraButtonProps {
    reasonDisabled?: string;
    disabledButtonContent?: ReactNode;
}

const Button = ({ reasonDisabled, disabledButtonContent, children, isDisabled, ...rest }: ButtonProps) => {
    return (
        <Tooltip label={reasonDisabled} isDisabled={!isDisabled}>
            <ChakraButton isDisabled={isDisabled} {...rest}>
                {(isDisabled && disabledButtonContent) || children}
            </ChakraButton>
        </Tooltip>
    );
};

export default Button;
