import { Box, Popover, Spinner, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import SettingsIcon from '../../assets/icons/lernfair/ico-settings.svg';
import { getAllNewUserNotificationsButMinimumFiveNotifications } from '../../helper/notification-helper';
import { AllNotifications, NewNotifications, NoNotifications } from './PanelContent';
import { Concrete_Notification } from '../../gql/graphql';

type Props = {
    userNotifications: Concrete_Notification[];
    loading: boolean;
    lastTimeCheckedNotifications: string;
    updateLastTimeChecked: () => void;
};

const NotificationPanel: React.FC<Props> = ({ userNotifications, lastTimeCheckedNotifications, loading, updateLastTimeChecked }) => {
    const [shouldShowAll, setShouldShowAll] = useState<boolean>(false);
    const [notificationsToShow, setNotificationsToShow] = useState<Concrete_Notification[]>([]);

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
                <Popover.Header height="headerSizePx" />
                <Popover.CloseButton />
                <Popover.Body>
                    {loading && <Spinner />}
                    <Box maxH={panelPropsAllDevices.maxH}>
                        {!shouldShowAll && notificationsToShow.length !== 0 && (
                            <NewNotifications
                                notificationsToShow={notificationsToShow}
                                lastTimeChecked={lastTimeCheckedNotifications}
                                handleClick={handleClick}
                                updateLastTimeChecked={() => updateLastTimeChecked()}
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
