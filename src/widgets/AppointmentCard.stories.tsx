import { VStack } from 'native-base';
import AppointmentCard from './AppointmentCard';
import { MockStudent } from '../User';

export default {
    title: 'Organisms/Appointments/AppointmentCard',
    component: AppointmentCard,
};

export const Base = {
    render: () => (
        <MockStudent>
            <VStack minW="420px" maxW="33%">
                <AppointmentCard
                    isGrid
                    onPressToCourse={() => null}
                    description={'My description'}
                    tags={[
                        {
                            name: 'Mathe',
                        },
                        {
                            name: 'Englisch',
                        },
                    ]}
                    duration={60}
                    image={'https://picsum.photos/480/360'}
                    title={'Lorem Ipsum'}
                />
            </VStack>
        </MockStudent>
    ),

    name: 'AppointmentCard',
};
