import { Box, View } from 'native-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import { CreateAppointmentProvider } from '../context/AppointmentContext';
import InstructionProgress from '../widgets/InstructionProgress';
import AppointmentCreation from './create-appointment/AppointmentCreation';
import AppointmentAssignment from './create-appointment/AppointmentAssignment';
import AppointmentsInsight from './create-appointment/AppointmentsInsight';

const CreateAppointment = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [noAppointments, setNoAppointments] = useState<boolean>(false);

    const { t } = useTranslation();
    const [courseId, setCourseId] = useState<number>();

    const onNext = useCallback(() => {
        if (currentIndex >= 3) return;
        setCurrentIndex((prev) => prev + 1);
        setNoAppointments(false);
    }, [currentIndex]);

    const onBack = useCallback(() => {
        setCurrentIndex((prev) => prev - 1);
    }, []);

    const returnToStepOne = useCallback(() => {
        setCurrentIndex((prev) => prev - 2);
    }, []);

    const skipStepTwo = useCallback(() => {
        setCurrentIndex((prev) => prev + 2);
        setNoAppointments(true);
    }, [currentIndex]);

    const goToStepTwo = useCallback(
        (id?: number) => {
            if (id) setCourseId(id);
            onNext();
        },
        [setCourseId, onNext]
    );

    return (
        <CreateAppointmentProvider>
            <AsNavigationItem path="create-appointments">
                <WithNavigation>
                    <Box mx="4">
                        <View position="sticky" mb={2} overflow="hidden">
                            <InstructionProgress
                                currentIndex={currentIndex}
                                instructions={[
                                    { label: t('appointment.create.assignmentProgress') },
                                    { label: t('appointment.create.appointmentViewProgress') },
                                    { label: t('appointment.create.appointmentAdd') },
                                ]}
                            />
                        </View>
                        {currentIndex === 0 && <AppointmentAssignment next={goToStepTwo} skipStepTwo={skipStepTwo} />}
                        {currentIndex === 1 && <AppointmentsInsight courseId={courseId} next={onNext} back={onBack} />}
                        {currentIndex === 2 && <AppointmentCreation back={noAppointments ? returnToStepOne : onBack} />}
                    </Box>
                </WithNavigation>
            </AsNavigationItem>
        </CreateAppointmentProvider>
    );
};

export default CreateAppointment;
