// @ts-nocheck
import { MatchStudentCard } from './MatchStudentCard';
import { Dissolve_Reason } from '../../gql/graphql';

export default {
    title: 'Organisms/Match/MatchStudentCard',
    component: MatchStudentCard,
};

export const MatchStudentCardActive = {
    render: () => (
        <MatchStudentCard
            match={{
                createdAt: new Date(),

                student: {
                    firstname: 'Albert',
                    lastname: 'Einstein',
                },

                subjectsFormatted: [
                    {
                        name: 'Physik',
                    },
                ],
            }}
        />
    ),

    name: 'MatchStudentCard / active',
};

export const MatchStudentCardDissolved = {
    render: () => (
        <MatchStudentCard
            match={{
                createdAt: new Date(),
                dissolved: true,
                dissolvedAt: new Date(),

                student: {
                    firstname: 'Albert',
                    lastname: 'Einstein',
                },

                subjectsFormatted: [
                    {
                        name: 'Physik',
                    },
                ],

                dissolvedBy: 'pupil',
                dissolveReasons: [Dissolve_Reason.NoMoreHelpNeeded],
            }}
        />
    ),

    name: 'MatchStudentCard / dissolved',
};
