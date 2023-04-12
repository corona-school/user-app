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

type UpdateAppointment = {
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
    }
}`);

const formatStart = (start: string) => {
    const date = DateTime.fromISO(start).toFormat('yyyy-MM-dd');
    const time = DateTime.fromISO(start).toFormat('HH:mm:ss');
    return { date, time };
};

const convertStartDate = (date: string, time: string) => {
    const dt = DateTime.fromISO(date);
    const t = DateTime.fromISO(time);

    const newDate = dt.set({
        hour: t.hour,
        minute: t.minute,
        second: t.second,
    });
    return newDate.toISO();
};

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

    const [cancelAppointment] = useMutation(
        gql(`
        mutation cancelAppointment($appointmentId: Float!) {
            appointmentCancel(appointmentId: $appointmentId)
        }
    `)
    );
    const [updateAppointments] = useMutation(
        gql(`
        mutation updateAppointment($appointmentsToBeUpdated: [AppointmentUpdateInput!]!) {
            appointmentsUpdate(appointmentsToBeUpdated: $appointmentsToBeUpdated)
            }
    `)
    );
    const handleCancelClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        cancelAppointment({ variables: { appointmentId: appointmentId } });
        navigate('/appointments');
    }, []);

    const handleUpdateClick = useCallback(() => {
        let appointmentsToBeUpdated: AppointmentUpdateInput[] = [];

        const convertedUpdatedAppointment = {
            id: updatedAppointment.id,
            title: updatedAppointment.title,
            description: updatedAppointment.description,
            start: convertStartDate(updatedAppointment.date, updatedAppointment.time),
            duration: updatedAppointment.duration,
        };

        appointmentsToBeUpdated.push(convertedUpdatedAppointment);
        console.log('updated', appointmentsToBeUpdated);
        updateAppointments({ variables: { appointmentsToBeUpdated } });
        navigate('/appointments');
    }, [
        updatedAppointment.date,
        updatedAppointment.description,
        updatedAppointment.duration,
        updatedAppointment.id,
        updatedAppointment.time,
        updatedAppointment.title,
    ]);

    return (
        <>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <DeleteAppointmentModal onDelete={() => handleCancelClick()} close={() => setShowDeleteModal(false)} />
            </Modal>
            <AppointmentEditForm errors={errors} appointmentsCount={0} updatedAppointment={updatedAppointment} setUpdatedAppointment={setUpdatedAppointment} />
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
