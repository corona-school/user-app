import { Image, VStack, Text, HStack, Box, Heading } from 'native-base';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import { ActionTypes } from '../../../types/achievement';
import ArrowRight from '../../../assets/icons/icon_arrow_right_yellow.svg';
import Calendar from '../../../assets/icons/icon_calendar_yellow.svg';
import Clock from '../../../assets/icons/icon_clock_yellow.svg';
import Info from '../../../assets/icons/icon_info_yellow.svg';

type NextStepsCardProps = {
    image: string;
    title: string;
    name: string;
    actionDescription: string;
    actionType: ActionTypes;
    maxSteps?: number;
    currentStep?: number;
    description?: string;
};

const NextStepsCard: React.FC<NextStepsCardProps> = ({ image, title, name, actionDescription, actionType, maxSteps, currentStep, description }) => {
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
        <VStack width="288px" height="288px" padding="24px" backgroundColor="primary.900" borderRadius="8px" justifyContent="space-between">
            <VStack width="fit-content" borderRadius="8px">
                <Image width="64px" height="64px" src={image} />
            </VStack>
            <VStack>
                <Text fontSize={12} fontWeight="medium" color="white" noOfLines={1}>
                    {title}
                </Text>
                <Heading color="white" noOfLines={1}>
                    {name}
                </Heading>
            </VStack>
            <HStack height="54px" width="100%" justifyContent="flex-start" alignItems="center">
                {maxSteps && currentStep && <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} />}
                {description && (
                    <Text fontSize={12} lineHeight={18} color="white" noOfLines={3}>
                        {description}
                    </Text>
                )}
            </HStack>
            <HStack alignItems="flex-start" space="4px" justifyContent="flex-start">
                {actionType && (
                    <VStack height="19px" position="relative" justifyContent="center">
                        <Box width="8px" height="8px">
                            {icon}
                        </Box>
                    </VStack>
                )}
                <Text fontSize={12} color="secondary.900" noOfLines={1}>
                    {actionDescription}
                </Text>
            </HStack>
        </VStack>
    );
};

export default NextStepsCard;
