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
    SMALL = 0.5,
    MEDIUM = 1,
    LARGE = 1.25,
}

export { ActionTypes, AchievementType, AchievementState, PolaroidImageSize, StreakImageSize, ShineSize };
