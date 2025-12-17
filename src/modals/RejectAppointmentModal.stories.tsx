import RejectAppointmentModal, { RejectType } from './RejectAppointmentModal';

export default {
    title: 'Organisms/Appointments',
    component: RejectAppointmentModal,
};

export const Base = {
    render: () => (
        <RejectAppointmentModal
            onDelete={() => console.log('delete appointment')}
            close={() => console.log('close modal because canceled')}
            rejectType={RejectType.DECLINE}
        />
    ),

    name: 'Reject Appointment Modal',
};
