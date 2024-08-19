import { Box, HStack, Modal, Pressable, Spacer, Text, Tooltip, VStack, useBreakpointValue } from 'native-base';
import { getIconForMessageType, isMessageValid } from '../../helper/notification-helper';
import TimeIndicator from './TimeIndicator';
import { useNavigate } from 'react-router-dom';
import { FC, useState } from 'react';
import { InterfaceBoxProps } from 'native-base/lib/typescript/components/primitives/Box';
import LeavePageModal from '../../modals/LeavePageModal';
import { Concrete_Notification } from '../../gql/graphql';
import AppointmentCancelledModal from './NotificationModal';
import AchievementMessageModal from '../../modals/AchievementMessageModal';

type Props = {
    userNotification: Concrete_Notification;
    isStandalone?: boolean;
    isRead?: boolean;
    updateLastTimeChecked?: () => void;
};

const MessageBox: FC<Props> = ({ userNotification, isStandalone, isRead, updateLastTimeChecked }) => {
    const [leavePageModalOpen, setLeavePageModalOpen] = useState<boolean>(false);
    const [achievementModalForId, setAchievementModalForId] = useState<number | null>(null);
    const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    if (!userNotification || !userNotification.message || !isMessageValid(userNotification.message)) return null;

    const { sentAt } = userNotification || { sentAt: '' };
    const { headline, body, type, navigateTo, modalText } = userNotification.message;
    const boxProps = {
        mb: 2,
        height: '100%',
        fullWidth: 320,
        width: 270,
        borderRadius: 10,
        maxHeight: 500,
    };

    const vStackProps = {
        mt: 2,
        maxW: 200,
    };

    const navigateToLink = () => {
        if (modalText) {
            setNotificationModalOpen(true);
        }
        if (typeof navigateTo !== 'string') return null;
        updateLastTimeChecked && updateLastTimeChecked();
        if (navigateTo.startsWith('/')) {
            // If it starts with a / it is treated as a relative path,
            // and we navigate in the User App

            if (navigateTo.startsWith('/achievement')) {
                // With the special link /achievement/{id} we open the Achievement Modal instead
                const achievementId = navigateTo.split('/')[2];
                setAchievementModalForId(parseInt(achievementId, 10));
            } else {
                return navigate(navigateTo);
            }
        } else {
            // Otherwise we treat it as an external link and warn the user:
            setLeavePageModalOpen(true);
        }
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
                    <Modal isOpen={leavePageModalOpen}>
                        <LeavePageModal url={navigateTo} messageType={type} onClose={() => setLeavePageModalOpen(false)} navigateTo={navigateExternal} />
                    </Modal>
                    {achievementModalForId !== null && (
                        <AchievementMessageModal achievementId={achievementModalForId} isOpenModal={true} onClose={() => setAchievementModalForId(null)} />
                    )}
                </>
            );
        } else if (modalText) {
            return (
                <>
                    <Pressable onPress={navigateToLink}>
                        <Component />
                    </Pressable>
                    <Modal isOpen={notificationModalOpen}>
                        <AppointmentCancelledModal
                            messageType={type}
                            onClose={() => setNotificationModalOpen(false)}
                            modalText={modalText}
                            headline={headline}
                        />
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
            maxH={boxProps.maxHeight}
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
                    <Tooltip maxW={300} label={body} _text={{ textAlign: 'center' }}>
                        <Pressable onPress={navigateToLink}>
                            <Text fontSize="sm" ellipsizeMode="tail" numberOfLines={isMobile ? 5 : 2}>
                                {body}
                            </Text>
                        </Pressable>
                    </Tooltip>
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
