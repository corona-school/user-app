import AchievementCard from './AchievementCard';
import { Achievement_State, Achievement_Type_Enum, Achievement_Action_Type_Enum } from '../../../gql/graphql';
import KanufahrtDschungel from '../../../assets/images/achievements/KanufahrtDschungel.png';
import SequenceExample01 from '../../../assets/images/achievements/Sequence_Example_01.png';
import SequenceExample04 from '../../../assets/images/achievements/Sequence_Example_04.png';
import { Meta } from '@storybook/react';

const meta: Meta<typeof AchievementCard> = {
    title: 'Organisms/Achievements/AchievementCard',
    component: AchievementCard,
};

export const AchievementCompletedCard = {
    render: () => (
        <AchievementCard
            achievementState={Achievement_State.Completed}
            achievementType={Achievement_Type_Enum.Tiered}
            image={KanufahrtDschungel}
            alternativeText="ein Polaroid Bild von Loki auf einer Kanufahrt durch den Dschungel"
            isNewAchievement={false}
            title="1. durchgeführter Termin"
            progressDescription="Progress description"
            showProgressBar={false}
        />
    ),

    name: 'Achievement Completed Card',
};

export const NewAchievementCompletedCard = {
    render: () => (
        <AchievementCard
            achievementState={Achievement_State.Completed}
            achievementType={Achievement_Type_Enum.Sequential}
            image={SequenceExample04}
            alternativeText="ein Polaroid Bild von Loki auf einer Kanufahrt durch den Dschungel"
            isNewAchievement
            title="1. durchgeführter Termin"
            progressDescription="Progress description"
            showProgressBar={false}
        />
    ),

    name: 'New Achievement Completed Card',
};

export const AchievementActiveCard = {
    render: () => (
        <AchievementCard
            achievementState={Achievement_State.Active}
            achievementType={Achievement_Type_Enum.Tiered}
            actionType={Achievement_Action_Type_Enum.Wait}
            image={KanufahrtDschungel}
            alternativeText="ein Polaroid Bild von Loki auf einer Kanufahrt durch den Dschungel"
            isNewAchievement
            title="1. durchgeführter Termin"
            showProgressBar={false}
            maxSteps={3}
            currentStep={1}
            progressDescription="Kurs in Prüfung"
        />
    ),

    name: 'Achievement Active Card',
};

export const AchievementInactiveCard = {
    render: () => (
        <AchievementCard
            achievementState={Achievement_State.Inactive}
            achievementType={Achievement_Type_Enum.Sequential}
            actionType={Achievement_Action_Type_Enum.Action}
            image={SequenceExample01}
            alternativeText="ein Polaroid Bild von Loki auf einer Kanufahrt durch den Dschungel"
            isNewAchievement
            title="1. durchgeführter Termin"
            showProgressBar={false}
            maxSteps={4}
            currentStep={1}
            progressDescription="Kennenlerngespräch buchen"
        />
    ),

    name: 'Achievement Inactive Card',
};

export default meta;
