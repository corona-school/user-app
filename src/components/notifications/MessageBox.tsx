import { getIconForMessageType, isMessageValid } from '../../helper/notification-helper';
import TimeIndicator from './TimeIndicator';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LeavePageModal from '../../modals/LeavePageModal';
import { Concrete_Notification } from '../../gql/graphql';
import NotificationModal from './NotificationModal';
import AchievementMessageModal from '../../modals/AchievementMessageModal';
import { Typography } from '../Typography';
import { cn } from '@/lib/Tailwind';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip';

interface MessageBoxProps {
    userNotification: Concrete_Notification;
    isStandalone?: boolean;
    isRead?: boolean;
    updateLastTimeChecked?: () => void;
}

const MessageBox = ({ userNotification, isStandalone, isRead, updateLastTimeChecked }: MessageBoxProps) => {
    const [leavePageModalOpen, setLeavePageModalOpen] = useState<boolean>(false);
    const [achievementModalForId, setAchievementModalForId] = useState<number | null>(null);
    const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

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
    const LinkedBox = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
        const Component = () => <div {...rest}>{children}</div>;
        if (typeof navigateTo === 'string') {
            return (
                <>
                    <div onClick={navigateToLink}>
                        <Component />
                    </div>
                    <LeavePageModal
                        isOpen={leavePageModalOpen}
                        url={navigateTo}
                        messageType={type}
                        onOpenChange={setLeavePageModalOpen}
                        navigateTo={navigateExternal}
                    />
                    {achievementModalForId !== null && (
                        <AchievementMessageModal achievementId={achievementModalForId} isOpenModal={true} onClose={() => setAchievementModalForId(null)} />
                    )}
                </>
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
                'cursor-pointer rounded-md mb-2 py-2 h-full max-h-[500px] hover:bg-primary-lighter',
                isRead ? 'bg-white' : 'bg-primary-lighter',
                !isStandalone ? 'w-full' : 'w-[270px]'
            )}
        >
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
