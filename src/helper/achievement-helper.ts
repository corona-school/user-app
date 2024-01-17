import { Achievement_State, AchievementsQuery, FurtherAchievementsQuery, GetOnboardingInfosQuery, Step } from '../gql/graphql';
import { Achievement } from '../types/achievement';
import FivePuzzlePieces from '../assets/images/achievements/five-puzzle-pieces.png';
import ThreePuzzlePieces from '../assets/images/achievements/three-puzzle-pieces.png';

export enum TypeofAchievementQuery {
    achievements = 'achievements',
    furtherAchievements = 'furtherAchievements',
    nextStepAchievements = 'nextStepAchievements',
}

export type AchievementsQueryType = {
    type: TypeofAchievementQuery.achievements;
    data?: AchievementsQuery;
};
export type InactiveAchievementsQueryType = {
    type: TypeofAchievementQuery.furtherAchievements;
    data?: FurtherAchievementsQuery;
};
export type NextStepAchievementsQueryType = {
    type: TypeofAchievementQuery.nextStepAchievements;
    data?: GetOnboardingInfosQuery;
};
function convertDataToAchievement(achievementWithType: AchievementsQueryType | InactiveAchievementsQueryType | NextStepAchievementsQueryType): Achievement[] {
    if (!achievementWithType?.data) {
        return [];
    }
    const query =
        achievementWithType.type === TypeofAchievementQuery.achievements
            ? achievementWithType.data.me.achievements
            : achievementWithType.type === TypeofAchievementQuery.furtherAchievements
            ? achievementWithType.data.me.furtherAchievements
            : achievementWithType.data.me.nextStepAchievements;
    const foundAchievements = query.map((achievement) => {
        const steps = achievement.steps?.map((step) => {
            const element: Step = {
                name: step.name,
                isActive: step.isActive ? true : false,
            };
            return element;
        });
        const element: Achievement = {
            id: achievement.id,
            name: achievement.name,
            subtitle: achievement.subtitle,
            description: achievement.description,
            image: achievement.image,
            alternativeText: achievement.alternativeText,
            actionType: achievement.actionType,
            achievementType: achievement.achievementType,
            achievementState: achievement.achievementState,
            steps,
            maxSteps: achievement.maxSteps,
            currentStep: achievement.currentStep,
            isNewAchievement: achievement.isNewAchievement ? true : false,
            progressDescription: achievement.progressDescription ? achievement.progressDescription : undefined,
            actionName: achievement.actionName ? achievement.actionName : undefined,
            actionRedirectLink: achievement.actionRedirectLink ? achievement.actionRedirectLink : undefined,
        };
        return element;
    });
    return foundAchievements;
}

const customSort = (a: Achievement_State, b: Achievement_State): number => {
    const order = [Achievement_State.Completed, Achievement_State.Active, Achievement_State.Inactive];

    return order.indexOf(a) - order.indexOf(b);
};

enum PuzzlePieceType {
    FIVE = 'five',
    THREE = 'three',
}
const getPuzzleEmptyState = (piecesCount: PuzzlePieceType): string => {
    let image: string = '';
    switch (piecesCount) {
        case PuzzlePieceType.FIVE:
            image = FivePuzzlePieces;
            break;
        case PuzzlePieceType.THREE:
            image = ThreePuzzlePieces;
            break;
        default:
            image = PuzzlePieceType.THREE;
    }
    return image;
};

export { convertDataToAchievement, customSort, PuzzlePieceType, getPuzzleEmptyState };
