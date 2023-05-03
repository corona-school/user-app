import { useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { Button, Modal, Stack, useToast } from 'native-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gql } from '../../gql';
import { AppointmentUpdateInput } from '../../gql/graphql';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import DeleteAppointmentModal from '../../modals/DeleteAppointmentModal';
import AppointmentEditForm from './AppointmentEditForm';
import { convertStartDate, formatStart } from '../../helper/appointment-helper';

type FormErrors = {
    title?: string;
    date?: string;
    time?: string;
    duration?: string;
    description?: string;
    dateNotInOneWeek?: string;
};

type EditProps = {
    appointmentId: number;
};

export type UpdateAppointment = {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
};

const getAppointmentById = gql(`
query getAppointmentById($appointmentId: Float!) {
    appointment(appointmentId: $appointmentId) {
        id
        start
        duration
        title
        description
        position
    }
}`);

const AppointmentEdit: React.FC<EditProps> = ({ appointmentId }) => {
    const { data } = useQuery(getAppointmentById, { variables: { appointmentId } });
    const [errors, setErrors] = useState<FormErrors>({});
    const [updatedAppointment, setUpdatedAppointment] = useState<UpdateAppointment>({
        id: data?.appointment?.id ?? 0,
        title: data?.appointment?.title ?? '',
        description: data?.appointment?.description ?? '',
        date: formatStart(data?.appointment.start).date,
        time: formatStart(data?.appointment.start).time,
        duration: data?.appointment.duration ?? 0,
    });

    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();
    const { isMobile } = useLayoutHelper();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const validateInputs = () => {
        const isDateMinOneWeekLater = (date: string): boolean => {
            const startDate = DateTime.fromISO(date);
            const diff = startDate.diffNow('days').days;
            if (diff >= 6) return true;
            return false;
        };

        if (!updatedAppointment.date) {
            setErrors({ ...errors, date: t('appointment.errors.date') });
            return false;
        } else {
            delete errors.date;
        }
        if (isDateMinOneWeekLater(updatedAppointment.date) === false) {
            setErrors({ ...errors, dateNotInOneWeek: t('appointment.errors.dateMinOneWeek') });
            return false;
        } else {
            delete errors.date;
        }
        if (!updatedAppointment.time.length) {
            setErrors({ ...errors, time: t('appointment.errors.time') });
            return false;
        } else {
            delete errors.time;
        }
        if (updatedAppointment.duration === 0) {
            setErrors({ ...errors, duration: t('appointment.errors.duration') });
            return false;
        } else {
            delete errors.duration;
        }
        return true;
    };

    const [cancelAppointment] = useMutation(
        gql(`
        mutation cancelAppointment($appointmentId: Float!) {
            appointmentCancel(appointmentId: $appointmentId)
        }
    `)
    );
    const [updateAppointment, { data: updateResponse, error: updateError }] = useMutation(
        gql(`
        mutation updateAppointment($appointmentToBeUpdated: AppointmentUpdateInput!) {
            appointmentUpdate(appointmentToBeUpdated: $appointmentToBeUpdated)
            }
    `)
    );

    const handleCancelClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        cancelAppointment({ variables: { appointmentId: appointmentId } });
        navigate('/appointments');
    }, []);

    const handleUpdateClick = useCallback(() => {
        if (validateInputs()) {
            const appointmentToBeUpdated: AppointmentUpdateInput = {
                id: updatedAppointment.id,
                title: updatedAppointment.title,
                description: updatedAppointment.description,
                start: convertStartDate(updatedAppointment.date, updatedAppointment.time),
                duration: updatedAppointment.duration,
            };
            updateAppointment({ variables: { appointmentToBeUpdated } });
            navigate('/appointments');
            toast.show({ description: t('appointment.editSuccess'), placement: 'top' });
        }
    }, [
        navigate,
        t,
        toast,
        updateAppointment,
        updatedAppointment.date,
        updatedAppointment.description,
        updatedAppointment.duration,
        updatedAppointment.id,
        updatedAppointment.time,
        updatedAppointment.title,
        validateInputs,
    ]);

    return (
        <>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <DeleteAppointmentModal onDelete={() => handleCancelClick()} close={() => setShowDeleteModal(false)} />
            </Modal>
            <AppointmentEditForm
                errors={errors}
                appointmentsCount={data?.appointment.position ?? 0}
                updatedAppointment={updatedAppointment}
                setUpdatedAppointment={setUpdatedAppointment}
            />
            <Stack space={3} mt={5} direction={isMobile ? 'column' : 'row'}>
                <Button onPress={() => handleUpdateClick()}>{t('appointment.saveChanges')}</Button>
                <Button onPress={() => setShowDeleteModal(true)} bgColor="danger.100" _text={{ color: 'white' }}>
                    {t('appointment.deleteAppointment')}
                </Button>
                <Button onPress={() => navigate(-1)} variant="outline" _text={{ color: 'primary.400' }}>
                    {t('appointment.goBack')}
                </Button>
            </Stack>
        </>
    );
};

export default AppointmentEdit;
