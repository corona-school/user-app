import { Box, HStack, Text, VStack, useBreakpointValue } from 'native-base';
import { ActionTypes } from '../../../types/achievement';
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
    isColorized?: boolean;
};

const CardActionDescription: React.FC<CardActionDescriptionProps> = ({ actionType, actionDescription, isColorized }) => {
    let icon;
    const colorize = useBreakpointValue({ base: true, md: isColorized });
    switch (actionType) {
        case ActionTypes.ACTION:
            icon = colorize ? <ArrowRightGreen /> : <ArrowRight />;
            break;
        case ActionTypes.APPOINTMENT:
            icon = colorize ? <CalendarGreen /> : <Calendar />;
            break;
        case ActionTypes.INFO:
            icon = colorize ? <InfoGreen /> : <Info />;
            break;
        case ActionTypes.WAIT:
            icon = colorize ? <ClockGreen /> : <Clock />;
            break;
        default:
            break;
    }
    const numberOfLines = useBreakpointValue({ base: 2, md: 1 });
    const justifyContent = useBreakpointValue({ base: 'flex-start', md: 'center' });

    return (
        <HStack alignItems="flex-start" space="4px" justifyContent={justifyContent}>
            {actionType && (
                <VStack height="12px" position="relative" justifyContent="flex-end">
                    <Box width="8px" height="8px">
                        {icon}
                    </Box>
                </VStack>
            )}
            <Text fontSize="xs" color={colorize ? 'primary.500' : 'black'} numberOfLines={numberOfLines}>
                {actionDescription}
            </Text>
        </HStack>
    );
};

export default CardActionDescription;
