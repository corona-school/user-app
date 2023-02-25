import { Box, HStack, Modal, Pressable, Spacer, Text, VStack } from 'native-base';
import { getIconForMessageType, isMessageValid } from '../../helper/notification-helper';
import TimeIndicator from './TimeIndicator';
import { useNavigate } from 'react-router-dom';
import { FC, useState } from 'react';
import { InterfaceBoxProps } from 'native-base/lib/typescript/components/primitives/Box';
import LeavePageModal from './LeavePageModal';
import { Concrete_Notification } from '../../gql/graphql';

type Props = {
    userNotification: Concrete_Notification;
    isStandalone?: boolean;
    isRead?: boolean;
};

const MessageBox: FC<Props> = ({ userNotification, isStandalone, isRead }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    if (!userNotification || !userNotification.message || !isMessageValid(userNotification.message)) return null;

    const { sentAt } = userNotification || { sentAt: '' };
    const { headline, body, type, navigateTo } = userNotification.message;

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
        setIsModalOpen(true);
    };

    const navigateExternal = () => (navigateTo ? window.open(navigateTo, '_blank') : null);

    const Icon = getIconForMessageType(type);

    const LinkedBox: FC<InterfaceBoxProps> = ({ children, ...boxProps }) => {
        const Component = () => <Box {...boxProps}>{children}</Box>;
        if (typeof navigateTo === 'string') {
            return (
                <>
                    <Pressable onPress={navigateToLink}>
                        <Component />
                    </Pressable>
                    <Modal isOpen={isModalOpen}>
                        <LeavePageModal url={navigateTo} messageType={type} onClose={() => setIsModalOpen(false)} navigateTo={navigateExternal} />
                    </Modal>
                </>
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
                    <Text bold fontSize="md" ellipsizeMode="tail" numberOfLines={1}>
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
