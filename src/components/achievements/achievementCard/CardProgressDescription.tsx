import { Box, HStack, Text, VStack, useBreakpointValue } from 'native-base';
import { Achievement_Type_Enum, Achievement_Action_Type_Enum } from '../../../gql/graphql';
import ArrowRightGreen from '../../../assets/icons/icon_arrow_right_green.svg';
import CalendarGreen from '../../../assets/icons/icon_calendar_green.svg';
import ClockGreen from '../../../assets/icons/icon_clock_green.svg';
import InfoGreen from '../../../assets/icons/icon_info_green.svg';
import ArrowRight from '../../../assets/icons/icon_arrow_right_dk_green.svg';
import Calendar from '../../../assets/icons/icon_calendar_dk_green.svg';
import Clock from '../../../assets/icons/icon_clock_dk_green.svg';
import Info from '../../../assets/icons/icon_info_dk_green.svg';

type CardprogressDescriptionProps = {
    actionType?: Achievement_Action_Type_Enum | null;
    achievementType?: Achievement_Type_Enum;
    progressDescription: string;
    isColorized?: boolean;
};

const CardProgressDescription: React.FC<CardprogressDescriptionProps> = ({ actionType, achievementType, progressDescription, isColorized }) => {
    let icon;
    const colorize = useBreakpointValue({ base: true, md: isColorized });
    switch (actionType) {
        case Achievement_Action_Type_Enum.Action:
            icon = colorize ? <ArrowRightGreen /> : <ArrowRight />;
            break;
        case Achievement_Action_Type_Enum.Appointment:
            icon = colorize ? <CalendarGreen /> : <Calendar />;
            break;
        case Achievement_Action_Type_Enum.Info:
            icon = colorize ? <InfoGreen /> : <Info />;
            break;
        case Achievement_Action_Type_Enum.Wait:
            icon = colorize ? <ClockGreen /> : <Clock />;
            break;
        default:
            break;
    }
    const numberOfLines = useBreakpointValue({ base: 2 });
    const alignItems = useBreakpointValue({ base: 'flex-start', md: 'center' });
    const iconHeight = useBreakpointValue({ base: '11.5px', md: '12.5px' });
    const fontSize = useBreakpointValue({ base: '10px', md: achievementType === Achievement_Type_Enum.Streak ? '10px' : '12px' });

    return (
        <HStack alignItems="center" space="4px" justifyContent={alignItems}>
            {actionType && (
                <VStack height={iconHeight} position="relative" justifyContent="center">
                    <Box width="8px" height="8px">
                        {icon}
                    </Box>
                </VStack>
            )}
            <Text fontSize={fontSize} color={colorize ? 'primary.500' : 'primary.900'} numberOfLines={numberOfLines} justifyContent="flex-start">
                {progressDescription}
            </Text>
        </HStack>
    );
};

export default CardProgressDescription;
