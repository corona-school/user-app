import AchievementModal from './AchievementModal';
import { Achievement_State, Achievement_Type_Enum } from '../../../gql/graphql';
import KanufahrtDschungel from '../../../assets/images/achievements/KanufahrtDschungel.png';
import ExampleStreakImageRecord from '../../../assets/images/achievements/example_streak_image_record.png';
import ExampleStreakImage from '../../../assets/images/achievements/example_streak_image.png';
import SequenceExample01 from '../../../assets/images/achievements/Sequence_Example_01.png';
import SequenceExample04 from '../../../assets/images/achievements/Sequence_Example_04.png';
import { Meta } from '@storybook/react';

const meta: Meta<typeof AchievementModal> = {
    title: 'Organisms/Achievements/AchievementModal',
    component: AchievementModal,
};

const steps = [
    {
        name: 'Dieser Text muss noch geliefert werden!',
    },
    {
        name: 'Dieser Text muss noch geliefert werden!',
        isActive: true,
    },
    {
        name: 'Dieser Text muss noch geliefert werden!',
    },
];

export const AchievementModalBasic = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            buttonText="Kontakt aufnehmen"
            achievementState={Achievement_State.Active}
            achievementType={Achievement_Type_Enum.Tiered}
            maxSteps={6}
            currentStep={4}
            image={KanufahrtDschungel}
            showModal
            steps={steps}
        />
    ),

    name: 'Achievement Modal',
};

export const AchievementCompletedModal = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            buttonText="Kontakt aufnehmen"
            achievementState={Achievement_State.Completed}
            achievementType={Achievement_Type_Enum.Tiered}
            maxSteps={6}
            currentStep={6}
            image={KanufahrtDschungel}
            showModal
            steps={steps}
        />
    ),

    name: 'Achievement Completed Modal',
};

export const NewAchievementCompletedModal = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            buttonText="Kontakt aufnehmen"
            achievementState={Achievement_State.Completed}
            achievementType={Achievement_Type_Enum.Tiered}
            maxSteps={6}
            currentStep={6}
            image={KanufahrtDschungel}
            isNewAchievement
            showModal
            steps={steps}
        />
    ),

    name: 'New Achievement Completed Modal',
};

export const AchievementModalSequential = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            achievementState={Achievement_State.Active}
            achievementType={Achievement_Type_Enum.Sequential}
            steps={steps}
            buttonText="Kontakt aufnehmen"
            buttonLink="https://www.google.de"
            image={SequenceExample01}
            showModal
        />
    ),

    name: 'Achievement Modal Sequential',
};

export const NewAchievementCompletedModalSequential = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            achievementState={Achievement_State.Completed}
            achievementType={Achievement_Type_Enum.Sequential}
            steps={steps}
            buttonText="Kontakt aufnehmen"
            buttonLink="https://www.google.de"
            image={SequenceExample04}
            isNewAchievement
            showModal
        />
    ),

    name: 'New Achievement Completed Modal Sequential',
};

export const AchievementModalAction = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            achievementState={Achievement_State.Active}
            achievementType={Achievement_Type_Enum.Sequential}
            steps={steps}
            buttonText="Kontakt aufnehmen"
            buttonLink="https://www.google.de"
            image={KanufahrtDschungel}
            showModal
        />
    ),

    name: 'Achievement Modal Action',
};

export const NewAchievementCompletedModalAction = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            achievementState={Achievement_State.Completed}
            achievementType={Achievement_Type_Enum.Sequential}
            steps={steps}
            buttonText="Kontakt aufnehmen"
            buttonLink="https://www.google.de"
            image={KanufahrtDschungel}
            isNewAchievement
            showModal
        />
    ),

    name: 'New Achievement Completed Modal Action',
};

export const AchievementModalStreak = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            achievementState={Achievement_State.Active}
            achievementType={Achievement_Type_Enum.Streak}
            maxSteps={16}
            currentStep={5}
            image={ExampleStreakImage}
            showModal
            steps={steps}
        />
    ),

    name: 'Achievement Modal Streak',
};

export const NewAchievementCompletedModalStreak = {
    render: () => (
        <AchievementModal
            title="Name des Lernangebots"
            description="Dieser Text muss noch geliefert werden! Wie cool, dass du dich ehrenamtlich engagieren möchtest, indem du Schüler:innen durch Nachhilfeunterricht unterstützt. Um mit der Lernunterstützung zu starten sind mehrere Aktionen nötig. Schließe jetzt den nächsten Schritt ab und komme dem Ziel einer neuen Lernunterstüzung ein Stück näher."
            achievementState={Achievement_State.Completed}
            achievementType={Achievement_Type_Enum.Streak}
            maxSteps={27}
            currentStep={27}
            image={ExampleStreakImageRecord}
            isNewAchievement
            showModal
            steps={steps}
        />
    ),

    name: 'New Achievement Completed Modal Streak',
};

export default meta;
