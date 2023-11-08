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

export { ActionTypes, AchievementType, AchievementState };
