import { Achievement_Action_Type_Enum, Achievement_State, Achievement_Type_Enum, Step } from '../gql/graphql';

enum PuzzleImageSize {
    SMALL = '62px',
    MEDIUM = '152px',
    LARGE = '210px',
}

enum PolaroidImageSize {
    SMALL = '62px',
    MEDIUM = '136px',
    LARGE = '210px',
}

enum StreakImageSize {
    SMALL = '90px',
    LARGE = '180px',
}

enum ShineSize {
    XSMALL = 0.5,
    SMALL = 0.75,
    MEDIUM = 1,
    LARGE = 1.25,
}

enum ShineOffset {
    XSMALL = 0.75,
    SMALL = 0.75,
    MEDIUM = 0.5,
    LARGE = 0.8,
}

type Achievement = {
    id: number;
    name: string;
    subtitle: string;
    description: string;
    image: string;
    alternativeText: string;
    actionType?: Achievement_Action_Type_Enum | null;
    achievementType: Achievement_Type_Enum;
    achievementState: Achievement_State;
    steps?: Step[];
    maxSteps: number;
    currentStep: number;
    isNewAchievement?: boolean;
    progressDescription?: string;
    actionName?: string;
    actionRedirectLink?: string;
};

export { PuzzleImageSize, PolaroidImageSize, StreakImageSize, ShineSize, ShineOffset };

export type { Achievement };
