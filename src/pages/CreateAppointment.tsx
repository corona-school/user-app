import { Box, View } from 'native-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import InstructionProgress from '../widgets/InstructionProgress';
import AppointmentCreation from './create-appointment/AppointmentCreation';
import AppointmentAssignment from './create-appointment/AppointmentAssignment';
import AppointmentsInsight from './create-appointment/AppointmentsInsight';

const CreateAppointment = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [noAppointments, setNoAppointments] = useState<boolean>(false);
    const [courseOrMatchId, setCourseOrMatchId] = useState<number>(0);
    const [isCourse, setIsCourse] = useState<boolean>(false);
    const [appointmentsTotal, setAppointmentsTotal] = useState<number>(0);

    const { t } = useTranslation();

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

    const skipStepTwo = useCallback(
        (id: number, isCourse?: boolean) => {
            if (isCourse) {
                setCourseOrMatchId(id);
                setIsCourse(true);
                setAppointmentsTotal(0);
            }
            if (!isCourse) {
                setCourseOrMatchId(id);
                setIsCourse(false);
                setAppointmentsTotal(0);
            }
            setCurrentIndex((prev) => prev + 2);
            setNoAppointments(true);
        },
        [currentIndex]
    );

    const goToStepTwo = useCallback(
        (id: number, isCourse?: boolean) => {
            if (isCourse) {
                setCourseOrMatchId(id);
                setIsCourse(true);
            }
            if (!isCourse) {
                setCourseOrMatchId(id);
                setIsCourse(false);
            }
            onNext();
        },
        [setCourseOrMatchId, onNext]
    );

    return (
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
                    {currentIndex === 1 && (
                        <AppointmentsInsight id={courseOrMatchId} isCourse={isCourse} next={onNext} back={onBack} setAppointmentsTotal={setAppointmentsTotal} />
                    )}
                    {currentIndex === 2 && (
                        <AppointmentCreation
                            back={noAppointments ? returnToStepOne : onBack}
                            courseOrMatchId={courseOrMatchId}
                            isCourse={isCourse}
                            appointmentsTotal={appointmentsTotal}
                        />
                    )}
                </Box>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default CreateAppointment;
