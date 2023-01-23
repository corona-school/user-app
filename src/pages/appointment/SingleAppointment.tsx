import AppointmentDetail from '../../components/appointment/AppointmentDetail';
import WithNavigation from '../../components/WithNavigation';

const SingleAppointment = () => {
    return (
        <WithNavigation showBack>
            <AppointmentDetail
                appointment={{
                    id: 0,
                    title: 'Termin #1',
                    organizers: [{ firstname: 'Anna', lastname: 'Maier' }],
                    startDate: '2023-02-28T15:00:00Z',
                    duration: 60,
                    meetingLink: '',
                    subcourseId: 3,
                    lectureId: 0,
                    participants: [{ firstname: 'Anna', lastname: 'Maier' }],
                    declinedBy: [],
                    isCancelled: false,
                    appointmentType: 'ONE_TO_ONE',
                }}
            />
        </WithNavigation>
    );
};

export default SingleAppointment;
