import { Box, Flex, Input, Pressable, Text, useTheme, View, VStack } from 'native-base';
import { InterfaceInputProps } from 'native-base/lib/typescript/components/primitives/Input/types';
import { useState } from 'react';
import ShowPassword from '../assets/icons/lernfair/lf-show-password.svg';
import HidePassword from '../assets/icons/lernfair/lf-hide-password.svg';

interface Props extends InterfaceInputProps {
    placeholder?: string;
    onChangeText?: (text: string) => any;
}

const PasswordInput: React.FC<Props> = (props) => {
    const { space } = useTheme();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <Flex style={{ position: 'relative' }} width={props.width} flex={props.flex} flexDirection="row" alignItems={'center'}>
            <VStack flex="1">
                {props.placeholder && (
                    <View position={'relative'} zIndex={10}>
                        <Text
                            style={{
                                opacity: 1,
                                zIndex: 10,
                                position: 'absolute',
                                left: space['3'],
                                top: 5,
                            }}
                        >
                            {props.placeholder}
                        </Text>
                    </View>
                )}
                <Input
                    {...props}
                    flex="1"
                    style={{ paddingTop: space['6'], paddingBottom: space['3'] }}
                    placeholder={undefined}
                    secureTextEntry={!showPassword}
                />
            </VStack>
            <Pressable
                position={'absolute'}
                right={space['1']}
                onPress={() => {
                    setShowPassword((prev) => !prev);
                }}
            >
                {!showPassword ? <ShowPassword /> : <HidePassword />}
            </Pressable>
        </Flex>
    );
};
export default PasswordInput;
