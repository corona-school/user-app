import { PupilScreeningCard } from './PupilScreeningCard';

export default {
    title: 'Organisms/Screening/PupilScreeningCard',
    component: PupilScreeningCard,
};

export const PupilScreeningCardSuccess = {
    render: () => (
        <PupilScreeningCard
            screening={{
                status: 'success',
                createdAt: new Date(),
                updatedAt: new Date(),
                invalidated: false,

                screeners: [
                    {
                        firstname: 'Max',
                        lastname: 'Musterscreener',
                    },
                ],
            }}
        />
    ),

    name: 'PupilScreeningCard / success',
};

export const PupilScreeningCardRejection = {
    render: () => (
        <PupilScreeningCard
            screening={{
                status: 'rejection',
                createdAt: new Date(),
                updatedAt: new Date(),
                invalidated: false,

                screeners: [
                    {
                        firstname: 'Max',
                        lastname: 'Musterscreener',
                    },
                ],
            }}
        />
    ),

    name: 'PupilScreeningCard / rejection',
};

export const PupilScreeningCardPending = {
    render: () => (
        <PupilScreeningCard
            screening={{
                status: 'pending',
                createdAt: new Date(),
                invalidated: false,
                screeners: [],
            }}
        />
    ),

    name: 'PupilScreeningCard / pending',
};

export const PupilScreeningCardDispute = {
    render: () => (
        <PupilScreeningCard
            screening={{
                status: 'dispute',
                createdAt: new Date(),
                invalidated: false,

                screeners: [
                    {
                        firstname: 'Max',
                        lastname: 'Musterscreener',
                    },
                ],
            }}
        />
    ),

    name: 'PupilScreeningCard / dispute',
};
