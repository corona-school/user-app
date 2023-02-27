import { Box, Button, Divider, Stack, useBreakpointValue } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateCourseAppointments } from '../../context/AppointmentContext';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { Appointment, AppointmentTypes } from '../../types/lernfair/Appointment';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import { appointmentsData } from '../../widgets/appointment/dummy/testdata';
import AppointmentsEmptyState from '../../widgets/AppointmentsEmptyState';

type Props = {
    next: () => void;
    back: () => void;
};

const CourseAppointments: React.FC<Props> = ({ next, back }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { appointmentsToBeCreated } = useCreateCourseAppointments();

    const { isMobile } = useLayoutHelper();

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    // TODO query course appointments by ID
    const _convertAppointments = () => {
        let convertedAppointments: Appointment[] = [];
        for (const appointment of appointmentsToBeCreated) {
            const converted = {
                id: 1,
                title: appointment.title,
                description: appointment.description,
                start: appointment.start,
                duration: appointment.duration,
                appointmentType: AppointmentTypes.GROUP,
            };
            convertedAppointments.push(converted);
        }
        return convertedAppointments;
    };

    const _allAppointmentsToShow = () => {
        const convertedAppointments = _convertAppointments();
        const all = appointmentsData.concat(convertedAppointments);
        return all;
    };
    const allAppointmentsToShow = _allAppointmentsToShow();

    return (
        <Box>
            <Box maxH={maxHeight} flex="1" mb="10">
                {allAppointmentsToShow.length === 0 ? (
                    <Box justifyContent="center">
                        <AppointmentsEmptyState title={t('appointment.empty.noAppointments')} subtitle={t('appointment.empty.createNewAppointmentDesc')} />
                    </Box>
                ) : (
                    <AppointmentList isReadOnly={true} appointments={allAppointmentsToShow} />
                )}
            </Box>

            <Button
                variant="outline"
                borderStyle="dashed"
                borderWidth="2"
                borderColor="primary.500"
                _text={{ color: 'primary.500' }}
                width="full"
                onPress={() => navigate('/create-course-appointment')}
            >
                {t('course.appointments.addOtherAppointment')}
            </Button>
            <Divider my="5" />

            <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" justifyContent="center" space={3}>
                <Button onPress={next} width={buttonWidth}>
                    {t('course.appointments.check')}
                </Button>
                <Button variant="outline" onPress={back} width={buttonWidth}>
                    {t('course.appointments.prevPage')}
                </Button>
            </Stack>
        </Box>
    );
};

export default CourseAppointments;
