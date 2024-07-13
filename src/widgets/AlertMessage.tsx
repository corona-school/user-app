import { Text, Alert, useTheme, HStack, useBreakpointValue } from 'native-base';

type Props = {
    content: string | any;
};

const AlertMessage: React.FC<Props> = ({ content }) => {
    const { space } = useTheme();

    const backgroundWidth = useBreakpointValue({
        base: '100%',
        lg: 'max-content',
    });

    return (
        <>
            <Alert alignItems="start" marginY={space['0.5']} width="100%" maxWidth={backgroundWidth} status="info">
                <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text>{content}</Text>
                </HStack>
            </Alert>
        </>
    );
};
export default AlertMessage;
