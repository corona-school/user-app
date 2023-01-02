import { Box, HStack, Pressable, Spacer, Text, VStack } from 'native-base';
import { getIconForMessageType } from '../../helper/notification-helper';
import { UserNotification } from '../../types/lernfair/Notification';
import TimeIndicator from './TimeIndicator';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { InterfaceBoxProps } from 'native-base/lib/typescript/components/primitives/Box';

type Props = {
    userNotification: UserNotification;
    isStandalone?: boolean;
    isRead?: boolean;
};

const MessageBox: FC<Props> = ({ userNotification, isStandalone, isRead }) => {
    const { sentAt } = userNotification;
    const { headline, body, messageType, navigateTo } = userNotification.message;

    const navigate = useNavigate();

    const boxProps = {
        mb: 2,
        height: 54,
        fullWidth: 320,
        width: 270,
        borderRadius: 10,
    };

    const vStackProps = {
        mt: 2,
        maxW: 200,
    };

    const navigateToLink = () => {
        if (typeof navigateTo !== 'string') return null;
        if (navigateTo.charAt(0) === '/') {
            return navigate(navigateTo);
        }
        return navigateExternal();
    };

    const navigateExternal = () => window.open(navigateTo, '_blank');

    const Icon = getIconForMessageType(messageType);

    const LinkedBox: FC<InterfaceBoxProps> = ({ children, ...boxProps }) => {
        const Component = () => <Box {...boxProps}>{children}</Box>;
        if (typeof navigateTo === 'string') {
            return (
                <Pressable onPress={navigateToLink}>
                    <Component />
                </Pressable>
            );
        }
        return <Component />;
    };

    return (
        <LinkedBox
            borderRadius={boxProps.borderRadius}
            bgColor={isRead ? 'ghost' : 'primary.100'}
            mb={boxProps.mb}
            h={boxProps.height}
            w={!isStandalone ? boxProps.fullWidth : boxProps.width}
        >
            <HStack alignItems="center" space={1}>
                <VStack>
                    <Box px="1.5">
                        <Icon />
                    </Box>
                </VStack>
                <VStack mt={vStackProps.mt} maxW={vStackProps.maxW}>
                    <Text bold fontSize="md">
                        {headline}
                    </Text>
                    <Text fontSize="sm" ellipsizeMode="tail" numberOfLines={1}>
                        {body}
                    </Text>
                </VStack>
                <Spacer />
                {!isStandalone && (
                    <VStack>
                        <TimeIndicator sentAt={sentAt} />
                    </VStack>
                )}
            </HStack>
        </LinkedBox>
    );
};

export default MessageBox;
