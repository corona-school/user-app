import { Box, View } from 'native-base';
import { useCallback, useState } from 'react';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import InstructionProgress from '../widgets/InstructionProgress';
import AppointmentAssignment from './create-appointment/AppointmentAssignment';
import AppointmentsView from './create-appointment/AppointmentsView';

const CreateAppointment = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [courseId, setCourseId] = useState<number>();

    const onNext = useCallback(() => {
        if (currentIndex >= 3) return;
        setCurrentIndex((prev) => prev + 1);
    }, [currentIndex]);

    const onBack = useCallback(() => {
        setCurrentIndex((prev) => prev - 1);
    }, []);

    const skipStepTwo = useCallback(() => {
        setCurrentIndex((prev) => prev + 2);
    }, [currentIndex]);

    const onStepOne = (id?: number) => {
        if (id) setCourseId(id);
        onNext();
    };

    return (
        <AsNavigationItem path="create-appointments">
            <WithNavigation>
                <Box mx="4">
                    <View position="sticky" mb={2} overflow="hidden">
                        <InstructionProgress
                            currentIndex={currentIndex}
                            instructions={[{ label: 'Zuordnung wählen' }, { label: 'Termine einsehen' }, { label: 'Termin hinzufügen' }]}
                        />
                    </View>
                    {currentIndex === 0 && <AppointmentAssignment next={onStepOne} skipStepTwo={skipStepTwo} />}
                    {currentIndex === 1 && <AppointmentsView courseId={courseId} next={onNext} back={onBack} />}
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default CreateAppointment;
