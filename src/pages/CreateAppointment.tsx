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
    const { t } = useTranslation();

    const onNext = useCallback(() => {
        if (currentIndex >= 3) return;
        setCurrentIndex((prev) => prev + 1);
    }, [currentIndex]);

    const onBack = useCallback(() => {
        setCurrentIndex((prev) => prev - 1);
    }, []);

    return (
        <CreateAppointmentProvider>
            <AsNavigationItem path="create-appointments">
                <WithNavigation>
                    <Box width={'90%'} mx="4">
                        <View position="sticky" mb="10" overflow="hidden">
                            <InstructionProgress
                                currentIndex={currentIndex}
                                instructions={[
                                    { label: t('appointment.create.assignmentProgress') },
                                    { label: t('appointment.create.appointmentViewProgress') },
                                    { label: t('appointment.create.appointmentAdd') },
                                ]}
                            />
                        </View>
                        {currentIndex === 0 && <AppointmentAssignment next={onNext} back={onBack} />}
                        {currentIndex === 1 && <AppointmentsInsight next={onNext} back={onBack} />}
                        {currentIndex === 2 && <AppointmentCreation back={onBack} />}
                    </Box>
                </WithNavigation>
            </AsNavigationItem>
        </CreateAppointmentProvider>
    );
};

export default CreateAppointment;
