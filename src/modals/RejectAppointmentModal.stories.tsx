import RejectAppointmentModal, { RejectType } from './RejectAppointmentModal';

export default {
    title: 'Organisms/Appointments',
    component: RejectAppointmentModal,
};

export const Base = {
    render: () => (
        <RejectAppointmentModal
            isOpen={true}
            onDelete={() => console.log('delete appointment')}
            onOpenChange={(open) => open && console.log('close modal because canceled')}
            rejectType={RejectType.DECLINE}
        />
    ),

    name: 'Reject Appointment Modal',
};
