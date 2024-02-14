import { Box, View } from 'native-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import WithNavigation from '../components/WithNavigation';
import InstructionProgress from '../widgets/InstructionProgress';
import AppointmentCreation from './create-appointment/AppointmentCreation';
import AppointmentAssignment from './create-appointment/AppointmentAssignment';
import AppointmentsInsight from './create-appointment/AppointmentsInsight';
import { CreateAppointmentProvider } from '../context/AppointmentContext';
import NotificationAlert from '../components/notifications/NotificationAlert';

const CreateAppointment = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [noAppointments, setNoAppointments] = useState<boolean>(false);
    const [courseOrMatchId, setCourseOrMatchId] = useState<number>(0);
    const [isCourse, setIsCourse] = useState<boolean>(false);
    const [appointmentsTotal, setAppointmentsTotal] = useState<number>(0);
    const [overrideMeetingLink, setOverrideMeetingLink] = useState<string | undefined>(undefined);

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
            setOverrideMeetingLink(undefined);
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
        <AsNavigationItem path="appointments">
            <WithNavigation headerLeft={<NotificationAlert />} showBack>
                <CreateAppointmentProvider>
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
                            <AppointmentsInsight
                                id={courseOrMatchId}
                                isCourse={isCourse}
                                next={onNext}
                                back={onBack}
                                setAppointmentsTotal={setAppointmentsTotal}
                                setOverrideMeetingLink={setOverrideMeetingLink}
                            />
                        )}
                        {currentIndex === 2 && (
                            <Box mt="10">
                                <AppointmentCreation
                                    back={noAppointments ? returnToStepOne : onBack}
                                    courseOrMatchId={courseOrMatchId}
                                    isCourse={isCourse}
                                    appointmentsTotal={appointmentsTotal}
                                    overrideMeetingLink={overrideMeetingLink}
                                />
                            </Box>
                        )}
                    </Box>
                </CreateAppointmentProvider>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default CreateAppointment;
