import { Box, Popover, Spinner, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import SettingsIcon from '../../assets/icons/lernfair/ico-settings.svg';
import { UserNotification } from '../../types/lernfair/Notification';
import { getAllNewUserNotificationsButMinimumFiveNotifications } from '../../helper/notification-helper';
import { AllNotifications, NewNotifications, NoNotifications } from './PanelContent';

type Props = {
    userNotifications: UserNotification[];
    loading: boolean;
    lastTimeCheckedNotifications: string;
};

const NotificationPanel: React.FC<Props> = ({ userNotifications, lastTimeCheckedNotifications, loading }) => {
    const [shouldShowAll, setShouldShowAll] = useState<boolean>(false);
    const [notificationsToShow, setNotificationsToShow] = useState<UserNotification[]>([]);

    const panelMarginLeft = useBreakpointValue({
        base: 3,
        lg: 0,
    });

    const panelMarginRight = useBreakpointValue({
        base: 0,
        lg: 10,
    });

    const panelPropsAllDevices = {
        maxH: 420,
        minW: 320,
    };

    const handleClick = () => {
        setShouldShowAll(!shouldShowAll);
    };

    useEffect(() => {
        if (userNotifications.length !== 0) {
            if (shouldShowAll) {
                return setNotificationsToShow(userNotifications);
            }
            setNotificationsToShow(getAllNewUserNotificationsButMinimumFiveNotifications(userNotifications, lastTimeCheckedNotifications));
        }
    }, [userNotifications, lastTimeCheckedNotifications, shouldShowAll]);

    return (
        <Box>
            <Popover.Content ml={panelMarginLeft} mr={panelMarginRight} minW={panelPropsAllDevices.minW}>
                <Popover.Arrow />
                <Popover.CloseButton />
                <Popover.Header>
                    <Box alignSelf="flex-end" mr={10}>
                        <SettingsIcon />
                    </Box>
                </Popover.Header>
                <Popover.Body>
                    {loading && <Spinner />}
                    <Box maxH={panelPropsAllDevices.maxH}>
                        {!shouldShowAll && notificationsToShow.length !== 0 && (
                            <NewNotifications
                                notificationsToShow={notificationsToShow}
                                lastTimeChecked={lastTimeCheckedNotifications}
                                handleClick={handleClick}
                            />
                        )}
                        {shouldShowAll && <AllNotifications userNotifications={notificationsToShow} lastTimeChecked={lastTimeCheckedNotifications} />}
                        {!notificationsToShow.length && <NoNotifications />}
                    </Box>
                </Popover.Body>
            </Popover.Content>
        </Box>
    );
};

export default NotificationPanel;
