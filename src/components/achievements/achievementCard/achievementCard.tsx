import { Box, Stack, Text } from 'native-base';
import Theme from '../../../Theme';
import PolaroidImageContainer from '../polaroid/getPolaroidImage';
import AchievementBadge from '../achievementBadge';
import NewAchievementShine from '../cosmetics/newAchievementShine';
import IndicatorBar from '../progressIndicators/indicatorBar';
import CardActionDescription from './cardActionDescription';
import { AchievementState, ActionTypes } from '../types';

type AchievementCardProps = {
    achievementState: AchievementState;
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
    achievementState,
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
    console.log(achievementState);

    return (
        <div
            style={{
                boxShadow: `${achievementState === AchievementState.INACTIVE ? '0px 0px 15px 0px #0000000D inset' : '0px 2px 4px 0px rgba(0, 0, 0, 0.25)'}`,
                width: 'fit-content',
                height: 'fit-content',
                borderRadius: '8px',
            }}
        >
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={achievementState !== AchievementState.COMPLETED ? 'flex-start' : 'center'}
                width="280px"
                height={achievementState === AchievementState.COMPLETED ? '300px' : '360px'}
                borderColor={achievementState === AchievementState.COMPLETED ? Theme.colors.primary[900] : Theme.colors.primary.grey}
                borderRadius="8px"
                borderWidth="1px"
                paddingY={'16px'}
                paddingX={'32px'}
                borderStyle={achievementState === AchievementState.INACTIVE ? 'dashed' : 'solid'}
                backgroundColor={
                    achievementState === AchievementState.ACTIVE
                        ? Theme.colors.white
                        : achievementState === AchievementState.COMPLETED
                        ? Theme.colors.primary[900]
                        : Theme.colors.primary.translucent
                }
            >
                {newAchievement && achievementState === AchievementState.COMPLETED && (
                    <>
                        <AchievementBadge />
                        <NewAchievementShine />
                    </>
                )}
                <Box>
                    <PolaroidImageContainer image={achievementState === AchievementState.COMPLETED ? image : undefined} alternativeText={alternativeText} />
                </Box>
                <Stack space={5} alignItems={'center'}>
                    <Stack space={0} alignItems={'center'}>
                        <Text fontSize="xs" color={achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900]}>
                            {subtitle}
                        </Text>
                        <Text fontSize="md" color={achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900]} bold>
                            {title}
                        </Text>
                    </Stack>
                    {achievementState !== AchievementState.COMPLETED && maxSteps && <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} />}
                    {actionDescription && <CardActionDescription actionType={actionType} actionDescription={actionDescription} />}
                </Stack>
            </Box>
        </div>
    );
};

export default AchievementCard;
