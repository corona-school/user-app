// @ts-nocheck
import StreakCard from './StreakCard';
import { Achievement_Action_Type_Enum, Achievement_State } from '../../../gql/graphql';
import ExampleStreakUnfinished from '../../../assets/images/achievements/example_streak_image.png';
import ExampleStreakFinished from '../../../assets/images/achievements/example_streak_image_record.png';

export default {
    title: 'Organisms/Achievements/Streak/StreakCard',
    component: StreakCard,
};

export const Base = {
    render: () => (
        <StreakCard
            streak={17}
            record={27}
            title="Pünktlichkeits-Rekord"
            achievementState={Achievement_State.Active}
            progressDescription="Weiter so, um den Rekord zu erhöhen"
            image={ExampleStreakUnfinished}
            alternativeText="27 day streak"
            actionType={Achievement_Action_Type_Enum.Action}
        />
    ),

    name: 'Streak Card',
};

export const StreakCardFinished = {
    render: () => (
        <StreakCard
            streak={27}
            record={27}
            title="Pünktlichkeits-Rekord"
            achievementState={Achievement_State.Completed}
            progressDescription="Weiter so, um den Rekord zu erhöhen"
            image={ExampleStreakFinished}
            alternativeText="27 day streak"
            actionType={Achievement_Action_Type_Enum.Action}
        />
    ),

    name: 'Streak Card Finished',
};

export const StreakCardWithoutRecord = {
    render: () => (
        <StreakCard
            streak={27}
            title="Lern-Fair Community Member"
            achievementState={Achievement_State.Active}
            progressDescription="Du bist bereits seit 8 Monaten ein Teil der Lern-Fair Community. Schön, dass du hier bist!"
            image={ExampleStreakFinished}
            alternativeText="27 day streak"
            actionType={Achievement_Action_Type_Enum.Action}
        />
    ),

    name: 'Streak Card Without Record',
};
