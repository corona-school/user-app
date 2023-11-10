enum ActionTypes {
    ACTION = 'ACTION',
    WAIT = 'WAIT',
    APPOINTMENT = 'APPOINTMENT',
    INFO = 'INFO',
}

enum AchievementType {
    SEQUENTIAL = 'SEQUENTIAL',
    TIERED = 'TIERED',
    STREAK = 'STREAK',
}

enum AchievementState {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

enum PuzzleImageSize {
    SMALL = '62px',
    MEDIUM = '136px',
    LARGE = '184',
}

enum PolaroidImageSize {
    SMALL = '72px',
    MEDIUM = '136px',
    LARGE = '210px',
}

enum StreakImageSize {
    SMALL = '72px',
    MEDIUM = '178px',
    LARGE = '224px',
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
    name: string;
    subtitle: string;
    description: string;
    achievedAt: string;
    achievedText: string;
    actionType: ActionTypes;
    achievementType: AchievementType;
    achievementState: AchievementState;
    maxSteps: number;
    currentStep: number;
    newAchievement?: boolean;
};

export { ActionTypes, AchievementType, AchievementState, PuzzleImageSize, PolaroidImageSize, StreakImageSize, ShineSize, ShineOffset };

export type { Achievement };
