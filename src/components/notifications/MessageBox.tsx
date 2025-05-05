import { getIconForMessageType, isMessageValid } from '../../helper/notification-helper';
import TimeIndicator from './TimeIndicator';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Concrete_Notification } from '../../gql/graphql';
import NotificationModal from './NotificationModal';
import { Typography } from '../Typography';
import { cn } from '@/lib/Tailwind';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip';
import { GlobalModalsContext } from '@/context/GlobalModalsProvider';
import { IconX } from '@tabler/icons-react';
import { Button } from '../Button';

interface MessageBoxProps {
    userNotification: Concrete_Notification;
    isStandalone?: boolean;
    isRead?: boolean;
    updateLastTimeChecked?: () => void;
    className?: string;
    onClose?: () => void;
}

const MessageBox = ({ userNotification, isStandalone, isRead, updateLastTimeChecked, className, onClose }: MessageBoxProps) => {
    const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const { openLeavePageModal, openAchievementModal } = useContext(GlobalModalsContext);

    if (!userNotification || !userNotification.message || !isMessageValid(userNotification.message)) return null;

    const { sentAt } = userNotification || { sentAt: '' };
    const { headline, body, type, navigateTo, modalText } = userNotification.message;

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
                openAchievementModal({ isOpen: true, options: { achievementId: parseInt(achievementId, 10) } });
            } else {
                return navigate(navigateTo);
            }
        } else {
            // Otherwise we treat it as an external link and warn the user:
            openLeavePageModal({
                isOpen: true,
                options: { url: navigateTo || 'www.google.com', messageType: type, navigateTo: navigateExternal },
            });
        }
    };

    const navigateExternal = () => (navigateTo ? window.open(navigateTo, '_blank') : null);

    const Icon = getIconForMessageType(type);
    const LinkedBox = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
        const Component = () => <div {...rest}>{children}</div>;
        if (typeof navigateTo === 'string') {
            return (
                <div onClick={navigateToLink}>
                    <Component />
                </div>
            );
        } else if (modalText) {
            return (
                <>
                    <div onClick={navigateToLink}>
                        <Component />
                    </div>
                    <NotificationModal
                        messageType={type}
                        isOpen={notificationModalOpen}
                        onOpenChange={setNotificationModalOpen}
                        modalText={modalText}
                        headline={headline}
                    />
                </>
            );
        }
        return <Component />;
    };

    return (
        <LinkedBox
            className={cn(
                'cursor-pointer relative rounded-md mb-2 py-2 h-full max-h-[500px] hover:bg-primary-lighter',
                isRead ? 'bg-white' : 'bg-primary-lighter',
                !isStandalone ? 'w-full' : 'w-[270px]',
                className
            )}
        >
            {onClose && (
                <Button
                    onClick={onClose}
                    variant="none"
                    size="auto"
                    className="size-6 rounded-full absolute top-[-6px] right-[-6px] shadow-sm bg-primary-lighter text-primary hover:shadow-md"
                >
                    <IconX className="size-3" style={{ strokeWidth: '1.5px' }} />
                </Button>
            )}
            <div className="flex items-center gap-x-1">
                <div className="flex flex-col px-1.5">
                    <Icon />
                </div>
                <div className="flex flex-col max-w-[200px]">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Typography className="font-semibold line-clamp-2 leading-3">{headline}</Typography>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-primary text-primary-foreground border-transparent max-w-80">
                                {headline}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Typography className="line-clamp-5 lg:line-clamp-2" variant="sm">
                                    {body}
                                </Typography>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-primary text-primary-foreground border-transparent max-w-80">
                                {body}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {!isStandalone && (
                    <div className="ml-auto">
                        <TimeIndicator sentAt={sentAt} />
                    </div>
                )}
            </div>
        </LinkedBox>
    );
};

export default MessageBox;
