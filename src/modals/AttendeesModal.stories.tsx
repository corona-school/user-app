// @ts-nocheck
import AttendeesModal from './AttendeesModal';

export default {
    title: 'Organisms/Appointments/AttendeesModal',
    component: AttendeesModal,
};

export const Base = {
    render: () => (
        <AttendeesModal
            participants={[
                {
                    id: 1,
                    firstname: 'Anna',
                    lastname: 'Pupil',
                    isPupil: true,
                },
                {
                    id: 2,
                    firstname: 'Tom',
                    lastname: 'Pupil',
                    isPupil: true,
                },
                {
                    id: 3,
                    firstname: 'Julian',
                    lastname: 'Pupil',
                    isPupil: true,
                },
                {
                    id: 4,
                    firstname: 'Emma',
                    lastname: 'Pupil',
                    isPupil: true,
                },
                {
                    id: 5,
                    firstname: 'Paula',
                    lastname: 'Pupil',
                    isPupil: true,
                },
                {
                    id: 6,
                    firstname: 'Emil',
                    lastname: 'Pupil',
                    isPupil: true,
                },
            ]}
            organizers={[
                {
                    id: 7,
                    firstname: 'Tobias',
                    lastname: 'Bork',
                    isStudent: true,
                },
                {
                    id: 8,
                    firstname: 'Marius',
                    lastname: 'Augustin',
                    isStudent: true,
                },
            ]}
            declinedBy={['1', '2', '3', '8']}
        />
    ),

    name: 'AttendeesModal',
};
