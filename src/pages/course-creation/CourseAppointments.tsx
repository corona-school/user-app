import { Box, Button, Divider, Stack, useBreakpointValue } from 'native-base';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateCourseAppointments } from '../../context/AppointmentContext';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { Appointment, AppointmentTypes } from '../../types/lernfair/Appointment';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import { appointmentsData } from '../../widgets/appointment/dummy/testdata';
import AppointmentsEmptyState from '../../widgets/AppointmentsEmptyState';
import ButtonRow from './ButtonRow';

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

    // * validate if min one appointment is created
    const tryNext = () => {};

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
                // * replace with open modal from another PR
                onPress={() => console.log('open modal')}
            >
                {t('course.appointments.addOtherAppointment')}
            </Button>
            <Divider my="5" />
            <ButtonRow onNext={next} onBack={back} />
        </Box>
    );
};

export default CourseAppointments;
