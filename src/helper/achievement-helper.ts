import { Achievement_Action_Type_Enum, Achievement_State, Achievement_Type_Enum, AchievementsQuery, InactiveAchievementsQuery, Step } from '../gql/graphql';
import { Achievement } from '../types/achievement';

function checkAndGetSecondEnumValue<T extends Record<string, string>>(enumElement: any, comparator: T): keyof T | null {
    if (typeof enumElement !== 'string') {
        return null;
    }
    const secondEnumElement = Object.keys(comparator).find((key) => comparator[key] === enumElement);
    if (secondEnumElement) {
        return secondEnumElement;
    }
    return null;
}

export type AchievementsQueryType = {
    type: 'achievements';
    data: AchievementsQuery;
};
export type InactiveAchievementsQueryType = {
    type: 'inactiveAchievements';
    data: InactiveAchievementsQuery;
};
function convertDataToAchievement(dataWithType: AchievementsQueryType | InactiveAchievementsQueryType): Achievement[] {
    const query = dataWithType.type === 'achievements' ? dataWithType.data.me.achievements : dataWithType.data.me.inactiveAchievements;
    const foundAchievements = query.map((achievement) => {
        const actionType: keyof typeof Achievement_Action_Type_Enum | null = checkAndGetSecondEnumValue(achievement.actionType, Achievement_Action_Type_Enum);
        const achievementType: keyof typeof Achievement_Type_Enum | null = checkAndGetSecondEnumValue(achievement.achievementType, Achievement_Type_Enum);
        const achievementState: keyof typeof Achievement_State | null = checkAndGetSecondEnumValue(achievement.achievementState, Achievement_State);
        if (!achievementType || !achievementState) throw new Error(`Error while trying to get the second enum value of ${achievement.achievementType}`);
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
            actionType: actionType ? Achievement_Action_Type_Enum[actionType] : undefined,
            achievementType: Achievement_Type_Enum[achievementType],
            achievementState: Achievement_State[achievementState],
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

export { checkAndGetSecondEnumValue, convertDataToAchievement, customSort };
