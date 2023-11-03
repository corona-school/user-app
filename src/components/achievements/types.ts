enum ActionTypes {
    ACTION = 'ACTION',
    WAIT = 'WAIT',
    APPOINTMENT = 'APPOINTMENT',
    INFO = 'INFO',
}

enum AchievementState {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

type AchievementModalProps = {
    title: string;
    name: string;
    description: string;
    buttonText?: string;
    newAchievement?: boolean;
    steps?: {
        description: string;
        isActive?: boolean;
    }[];
    actionDescription?: string;
    image?: string;
    alternativeText?: string;
    achievementState?: AchievementState;
    onClose?: () => void;
};

export { ActionTypes, AchievementState };

export type { AchievementModalProps };
