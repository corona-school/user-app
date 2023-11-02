import { Box, Stack, Text } from 'native-base';
import { ActionTypes } from './achievementCard';
import ArrowRight from '../../../assets/icons/icon_arrow_right.svg';
import Calendar from '../../../assets/icons/icon_calendar.svg';
import Clock from '../../../assets/icons/icon_clock.svg';
import Info from '../../../assets/icons/icon_info.svg';

type CardActionDescriptionProps = {
    actionType?: ActionTypes;
    actionDescription: string;
};

const CardActionDescription: React.FC<CardActionDescriptionProps> = ({ actionType, actionDescription }) => {
    let icon;

    switch (actionType) {
        case ActionTypes.ACTION:
            icon = <ArrowRight />;
            break;
        case ActionTypes.APPOINTMENT:
            icon = <Calendar />;
            break;
        case ActionTypes.INFO:
            icon = <Info />;
            break;
        case ActionTypes.WAIT:
            icon = <Clock />;
            break;
        default:
            break;
    }

    return (
        <Stack direction={'row'} alignItems={'center'} space={1}>
            <Box width={'12px'} height={'12px'} position={'relative'}>
                {icon}
            </Box>
            <Text fontSize={'xs'}>{actionDescription}</Text>
        </Stack>
    );
};

export default CardActionDescription;
