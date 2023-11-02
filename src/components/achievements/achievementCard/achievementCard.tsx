import { Box, PresenceTransition, Stack, Text } from 'native-base';
import Theme from '../../../Theme';
import PolaroidImageContainer from '../polaroid/getPolaroidImage';
import AchievementBadge from '../achievementBadge';
import NewAchievementShine from './newAchievementShine';
import { Easing } from 'react-native';
import IndicatorBar from '../progressIndicators/indicatorBar';
import CardActionDescription from './cardActionDescription';

enum ActionTypes {
    ACTION = 'ACTION',
    WAIT = 'WAIT',
    APPOINTMENT = 'APPOINTMENT',
    INFO = 'INFO',
}

enum CardState {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

type AchievementCardProps = {
    cardState: CardState;
    actionType?: ActionTypes;
    image: string | undefined;
    alternativeText: string;
    newAchievement?: boolean;
    subtitle: string;
    title: string;
    maxSteps?: number;
    currentStep?: number;
    actionDescription?: string;
};

const AchievementCard: React.FC<AchievementCardProps> = ({
    cardState,
    actionType,
    image,
    alternativeText,
    newAchievement,
    subtitle,
    title,
    maxSteps,
    currentStep,
    actionDescription,
}) => {
    console.log(actionDescription);

    return (
        <div
            style={{
                boxShadow: `${cardState === CardState.INACTIVE ? '0px 0px 15px 0px #0000000D inset' : '0px 2px 4px 0px rgba(0, 0, 0, 0.25)'}`,
                width: 'fit-content',
                height: 'fit-content',
                borderRadius: '8px',
            }}
        >
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={cardState !== CardState.COMPLETED ? 'flex-start' : 'center'}
                width="280px"
                height={cardState === CardState.COMPLETED ? '300px' : '360px'}
                borderColor={cardState === CardState.COMPLETED ? Theme.colors.primary[900] : Theme.colors.primary.grey}
                borderRadius="8px"
                borderWidth="1px"
                paddingY={'16px'}
                paddingX={'32px'}
                borderStyle={cardState === CardState.INACTIVE ? 'dashed' : 'solid'}
                backgroundColor={
                    cardState === CardState.ACTIVE
                        ? Theme.colors.white
                        : cardState === CardState.COMPLETED
                        ? Theme.colors.primary[900]
                        : Theme.colors.primary.translucent
                }
            >
                {newAchievement && cardState === CardState.COMPLETED && (
                    <>
                        <AchievementBadge />
                        <NewAchievementShine show={newAchievement} />
                    </>
                )}
                <PresenceTransition
                    visible={cardState === CardState.COMPLETED}
                    initial={{
                        rotate: '0deg',
                        translateY: 20,
                    }}
                    animate={{
                        rotate: '-5deg',
                        translateY: -10,
                        transition: {
                            easing: Easing.out(Easing.ease),
                            duration: 750,
                        },
                    }}
                >
                    <PolaroidImageContainer image={cardState === CardState.COMPLETED ? image : undefined} alternativeText={alternativeText} />
                </PresenceTransition>
                <Stack space={5} alignItems={'center'}>
                    <Stack space={0} alignItems={'center'}>
                        <Text fontSize="xs" color={cardState === CardState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900]}>
                            {subtitle}
                        </Text>
                        <Text fontSize="md" color={cardState === CardState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900]} bold>
                            {title}
                        </Text>
                    </Stack>
                    {cardState !== CardState.COMPLETED && maxSteps && <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} />}
                    {actionDescription && <CardActionDescription actionType={actionType} actionDescription={actionDescription} />}
                </Stack>
            </Box>
        </div>
    );
};

export default AchievementCard;

export { CardState, ActionTypes };
