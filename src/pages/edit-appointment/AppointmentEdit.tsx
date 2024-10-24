import { useMutation, useQuery } from '@apollo/client';
import { Button, Stack, useToast } from 'native-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gql } from '../../gql';
import { AppointmentUpdateInput } from '../../gql/graphql';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AppointmentEditForm from './AppointmentEditForm';
import { convertStartDate, formatStart } from '../../helper/appointment-helper';
import { PUPIL_APPOINTMENT, STUDENT_APPOINTMENT } from '../Appointment';
import { DateTime } from 'luxon';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useBreadcrumbRoutes } from '@/hooks/useBreadcrumb';

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
        displayName
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
        time: DateTime.fromISO(data?.appointment.start).toFormat('HH:mm'),
        duration: data?.appointment.duration ?? 0,
    });

    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();
    const { isMobile } = useLayoutHelper();
    const breadcrumbRoutes = useBreadcrumbRoutes();

    const isInputValid = () => {
        if (!updatedAppointment.date) {
            setErrors({ ...errors, date: t('appointment.errors.date') });
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

    const [updateAppointment] = useMutation(
        gql(`
        mutation updateAppointment($appointmentToBeUpdated: AppointmentUpdateInput!) {
            appointmentUpdate(appointmentToBeUpdated: $appointmentToBeUpdated)
            }
    `),
        { refetchQueries: [PUPIL_APPOINTMENT, STUDENT_APPOINTMENT] }
    );

    const handleUpdateClick = useCallback(async () => {
        if (isInputValid()) {
            const appointmentToBeUpdated: AppointmentUpdateInput = {
                id: updatedAppointment.id,
                title: updatedAppointment.title,
                description: updatedAppointment.description,
                start: convertStartDate(updatedAppointment.date, updatedAppointment.time),
                duration: updatedAppointment.duration,
            };

            await updateAppointment({ variables: { appointmentToBeUpdated } });
            toast.show({ description: t('appointment.editSuccess'), placement: 'top' });
            navigate(`/appointment/${updatedAppointment.id}`);
        }
    }, [
        navigate,
        t,
        toast,
        updatedAppointment,
        updateAppointment,
        updatedAppointment.date,
        updatedAppointment.description,
        updatedAppointment.duration,
        updatedAppointment.id,
        updatedAppointment.time,
        updatedAppointment.title,
        isInputValid,
    ]);

    const appointmentTile = data?.appointment?.title || t('appointment.appointmentTile.lecture', { position: data?.appointment?.position });

    return (
        <>
            <Breadcrumb
                items={[
                    breadcrumbRoutes.APPOINTMENTS,
                    { label: appointmentTile, route: `${breadcrumbRoutes.APPOINTMENT.route}/${appointmentId}` },
                    breadcrumbRoutes.EDIT_APPOINTMENT,
                ]}
                className="mb-4"
            />
            <AppointmentEditForm
                errors={errors}
                appointmentsCount={data?.appointment.position ?? 0}
                updatedAppointment={updatedAppointment}
                setUpdatedAppointment={setUpdatedAppointment}
            />
            <Stack space={3} mt={5} direction={isMobile ? 'column' : 'row'}>
                <Button onPress={() => navigate(-1)} variant="outline">
                    {t('appointment.goBack')}
                </Button>
                <Button onPress={async () => await handleUpdateClick()}>{t('appointment.saveChanges')}</Button>
            </Stack>
        </>
    );
};

export default AppointmentEdit;
