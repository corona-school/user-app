import { Box, View } from 'native-base';
import { useCallback, useState } from 'react';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import InstructionProgress from '../widgets/InstructionProgress';
import AddAppointment from './create-appointment/AddAppointment';
import AppointmentAssignment from './create-appointment/AppointmentAssignment';
import AppointmentsView from './create-appointment/AppointmentsView';

const CreateAppointment = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const onNext = useCallback(() => {
        if (currentIndex >= 3) return;
        setCurrentIndex((prev) => prev + 1);
    }, [currentIndex]);

    const onBack = useCallback(() => {
        if (currentIndex === 0) return;
        setCurrentIndex((prev) => prev - 1);
    }, []);

    return (
        <AsNavigationItem path="create-appointments">
            <WithNavigation>
                <Box width={'90%'} mx="4">
                    <View position="sticky" mb="10" overflow="hidden">
                        <InstructionProgress
                            currentIndex={currentIndex}
                            instructions={[{ label: 'Zuordnung wählen' }, { label: 'Termine einsehen' }, { label: 'Termin hinzufügen' }]}
                        />
                    </View>
                    {currentIndex === 0 && <AppointmentAssignment next={onNext} back={onBack} />}
                    {currentIndex === 1 && <AppointmentsView next={onNext} back={onBack} />}
                    {currentIndex === 2 && <AddAppointment />}
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default CreateAppointment;
