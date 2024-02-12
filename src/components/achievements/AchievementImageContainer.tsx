import { Box, VStack, PresenceTransition, Image, useBreakpointValue } from 'native-base';
import CompletePolaroid from './polaroid/CompletePolaroid';
import EmptyPolaroidField from './polaroid/EmptyPolaroidField';
import { PuzzleImageSize, StreakImageSize } from '../../types/achievement';
import StreakImageContainer from './streak/StreakImageContainer';
import { Achievement_State, Achievement_Type_Enum } from '../../gql/graphql';

type AchievementImageContainerProps = {
    image: string | undefined;
    alternativeText: string;
    achievementType: Achievement_Type_Enum;
    achievementState?: Achievement_State;
    record?: number;
    isRecord?: boolean;
    isLarge?: boolean;
};

const AchievementImageContainer: React.FC<AchievementImageContainerProps> = ({
    image,
    alternativeText,
    achievementType,
    achievementState,
    record,
    isRecord,
    isLarge,
}) => {
    const puzzleBorderWidth = useBreakpointValue({
        base: isLarge ? PuzzleImageSize.MEDIUM : PuzzleImageSize.SMALL,
        md: PuzzleImageSize.MEDIUM,
        lg: isLarge ? PuzzleImageSize.LARGE : PuzzleImageSize.MEDIUM,
    });
    const streakImageSize = useBreakpointValue({
        base: isLarge ? StreakImageSize.LARGE : StreakImageSize.SMALL,
        md: isLarge ? StreakImageSize.LARGE : StreakImageSize.SMALL,
    });
    const puzzleBorderRadius = useBreakpointValue({ base: isLarge ? '3px' : '2px', md: '3px', lg: isLarge ? '4px' : '3px' });
    const shadow = useBreakpointValue({ base: 3, md: 5, lg: 9 });
    switch (achievementType) {
        case Achievement_Type_Enum.Tiered:
            return (
                <VStack alignItems="center" width="fit-content">
                    {image && achievementState === Achievement_State.Completed ? (
                        <PresenceTransition
                            initial={{
                                rotate: '-5deg',
                            }}
                        >
                            <CompletePolaroid image={image} alternativeText={alternativeText} isLarge={isLarge} />
                        </PresenceTransition>
                    ) : (
                        <EmptyPolaroidField isLarge={isLarge} />
                    )}
                </VStack>
            );
        case Achievement_Type_Enum.Streak:
            if (!image) return null;
            return (
                <VStack alignItems="center" width={streakImageSize}>
                    <StreakImageContainer streak={record || 0} image={image} alternativeText={alternativeText} size={streakImageSize} isRecord={isRecord} />
                </VStack>
            );
        case Achievement_Type_Enum.Sequential:
            return (
                <VStack alignItems="center">
                    <Box
                        width={puzzleBorderWidth}
                        height={puzzleBorderWidth}
                        borderRadius={puzzleBorderRadius}
                        overflow={'hidden'}
                        shadow={achievementState === Achievement_State.Completed && shadow}
                    >
                        <Image src={image} alt={alternativeText} width="100%" height="100%" />
                    </Box>
                </VStack>
            );
        default:
            return null;
    }
};

export default AchievementImageContainer;
