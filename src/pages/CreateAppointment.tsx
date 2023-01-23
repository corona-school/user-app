import { Box } from 'native-base';
import { useCallback, useState } from 'react';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import InstructionProgress from '../widgets/InstructionProgress';
import AppointmentAssignment from './create-appointment/AppointmentAssignment';

const CreateAppointment = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const onNext = useCallback(() => {
        if (currentIndex >= 3) {
            return;
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex]);

    const onBack = useCallback(() => {
        setCurrentIndex((prev) => prev - 1);
    }, []);

    return (
        <AsNavigationItem path="create-appointments">
            <WithNavigation>
                <Box width={'80%'}>
                    <InstructionProgress
                        currentIndex={0}
                        instructions={[{ label: 'Zuordnung wählen' }, { label: 'Termine einsehen' }, { label: 'Termin hinzufügen' }]}
                    />
                    {currentIndex === 0 && <AppointmentAssignment />}
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default CreateAppointment;
