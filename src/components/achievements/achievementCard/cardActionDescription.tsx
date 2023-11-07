import { Box, HStack, Text } from 'native-base';
import { ActionTypes } from '../types';
import ArrowRightGreen from '../../../assets/icons/icon_arrow_right_green.svg';
import CalendarGreen from '../../../assets/icons/icon_calendar_green.svg';
import ClockGreen from '../../../assets/icons/icon_clock_green.svg';
import InfoGreen from '../../../assets/icons/icon_info_green.svg';
import ArrowRight from '../../../assets/icons/icon_arrow_right.svg';
import Calendar from '../../../assets/icons/icon_calendar.svg';
import Clock from '../../../assets/icons/icon_clock.svg';
import Info from '../../../assets/icons/icon_info.svg';

type CardActionDescriptionProps = {
    actionType?: ActionTypes;
    actionDescription: string;
    isMobile?: boolean;
};

const CardActionDescription: React.FC<CardActionDescriptionProps> = ({ actionType, actionDescription, isMobile }) => {
    let icon;

    switch (actionType) {
        case ActionTypes.ACTION:
            icon = isMobile ? <ArrowRightGreen /> : <ArrowRight />;
            break;
        case ActionTypes.APPOINTMENT:
            icon = isMobile ? <CalendarGreen /> : <Calendar />;
            break;
        case ActionTypes.INFO:
            icon = isMobile ? <InfoGreen /> : <Info />;
            break;
        case ActionTypes.WAIT:
            icon = isMobile ? <ClockGreen /> : <Clock />;
            break;
        default:
            break;
    }

    return (
        <HStack alignItems="center" space="4px" justifyContent={isMobile ? 'flex-start' : 'center'}>
            {actionType && (
                <Box width="12px" height="12px" position="relative">
                    {icon}
                </Box>
            )}
            <Text fontSize="xs" color={isMobile ? 'primary.500' : 'black'}>
                {actionDescription}
            </Text>
        </HStack>
    );
};

export default CardActionDescription;
