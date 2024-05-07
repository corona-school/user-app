import { MatchStudentCard } from './MatchStudentCard';

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
                dissolveReasonEnum: 'noMoreHelpNeeded',
            }}
        />
    ),

    name: 'MatchStudentCard / dissolved',
};
