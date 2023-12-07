import { Box, HStack, Text, VStack, useBreakpointValue } from 'native-base';
import { AchievementType, ActionTypes } from '../../../types/achievement';
import ArrowRightGreen from '../../../assets/icons/icon_arrow_right_green.svg';
import CalendarGreen from '../../../assets/icons/icon_calendar_green.svg';
import ClockGreen from '../../../assets/icons/icon_clock_green.svg';
import InfoGreen from '../../../assets/icons/icon_info_green.svg';
import ArrowRight from '../../../assets/icons/icon_arrow_right_dk_green.svg';
import Calendar from '../../../assets/icons/icon_calendar_dk_green.svg';
import Clock from '../../../assets/icons/icon_clock_dk_green.svg';
import Info from '../../../assets/icons/icon_info_dk_green.svg';

type CardprogressDescriptionProps = {
    actionType?: ActionTypes;
    achievementType?: AchievementType;
    progressDescription: string;
    isColorized?: boolean;
};

const CardProgressDescription: React.FC<CardprogressDescriptionProps> = ({ actionType, achievementType, progressDescription, isColorized }) => {
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
    const iconHeight = useBreakpointValue({ base: '11.5px', md: '12.5px' });
    const fontSize = useBreakpointValue({ base: '10px', md: achievementType === AchievementType.STREAK ? '10px' : '12px' });

    return (
        <HStack alignItems="flex-start" space="4px" justifyContent={justifyContent}>
            {actionType && (
                <VStack height={iconHeight} position="relative" justifyContent="flex-end">
                    <Box width="8px" height="8px">
                        {icon}
                    </Box>
                </VStack>
            )}
            <Text fontSize={fontSize} color={colorize ? 'primary.500' : 'primary.900'} numberOfLines={numberOfLines}>
                {progressDescription}
            </Text>
        </HStack>
    );
};

export default CardProgressDescription;
