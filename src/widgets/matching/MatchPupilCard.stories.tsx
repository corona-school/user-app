// @ts-nocheck
import { MatchPupilCard } from './MatchPupilCard';
import { Dissolve_Reason } from '../../gql/graphql';

export default {
    title: 'Organisms/Match/MatchPupilCard',
    component: MatchPupilCard,
};

export const MatchPupilCardActive = {
    render: () => (
        <MatchPupilCard
            match={{
                createdAt: new Date(),

                pupil: {
                    firstname: 'Albert',
                    lastname: 'Einstein',
                },

                subjectsFormatted: [
                    {
                        name: 'Physik',
                    },
                ],

                dissolveReasons: [],
            }}
        />
    ),

    name: 'MatchPupilCard / active',
};

export const MatchPupilCardDissolved = {
    render: () => (
        <MatchPupilCard
            match={{
                createdAt: new Date(),
                dissolved: true,
                dissolvedAt: new Date(),

                pupil: {
                    firstname: 'Albert',
                    lastname: 'Einstein',
                },

                subjectsFormatted: [
                    {
                        name: 'Physik',
                    },
                ],

                dissolvedBy: 'student',
                dissolveReasons: [Dissolve_Reason.NoMoreHelpNeeded],
            }}
        />
    ),

    name: 'MatchPupilCard / dissolved',
};
