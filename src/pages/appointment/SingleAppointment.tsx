import AppointmentDetail from '../../components/appointment/AppointmentDetail';
import WithNavigation from '../../components/WithNavigation';
import { UserType } from '../../types/lernfair/User';

const SingleAppointment = () => {
    return (
        <WithNavigation showBack>
            <AppointmentDetail
                id={1}
                appointmentType={'GROUP'}
                instructors={['Anna Maier', 'Klaus Kleber', 'Hans Huber']}
                participants={['Max Müller', 'Mara Muster', 'Paula Peter', 'Mia Maus', 'Sarah Sonntag']}
                appointmentTitle={'Lektion: Grundlagen td'}
                courseTitle={'Test von td'}
                description={
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
                }
                startDate={'2023-01-20T15:00Z'}
                duration={60}
                appointmentsCount={2}
                appointmentsTotal={5}
                userType={UserType.PUPIL}
                meetingLink={'https://www.lern-fair.de/'}
            />
        </WithNavigation>
    );
};

export default SingleAppointment;
