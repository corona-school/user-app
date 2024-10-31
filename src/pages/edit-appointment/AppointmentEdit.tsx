import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gql } from '../../gql';
import { PUPIL_APPOINTMENT, STUDENT_APPOINTMENT } from '../Appointment';
import { DateTime } from 'luxon';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useBreadcrumbRoutes } from '@/hooks/useBreadcrumb';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { TextArea } from '@/components/TextArea';
import { Typography } from '@/components/Typography';
import { AppointmentUpdateInput, Lecture_Appointmenttype_Enum } from '@/gql/graphql';
import { convertStartDate } from '@/helper/appointment-helper';

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

export type FormState = {
    id: number;
    title: string;
    description: string;
    date?: Date;
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
        appointmentType
        matchId
        subcourseId
    }
}`);

const AppointmentEdit: React.FC<EditProps> = ({ appointmentId }) => {
    const { data, loading: isLoading } = useQuery(getAppointmentById, { variables: { appointmentId } });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const breadcrumbRoutes = useBreadcrumbRoutes();
    const [updatedAppointment, setUpdatedAppointment] = useState<FormState>({
        id: 0,
        title: '',
        description: '',
        time: '',
        duration: 0,
    });

    useEffect(() => {
        if (data) {
            setUpdatedAppointment({
                id: data.appointment.id,
                title: data.appointment.title ?? '',
                description: data.appointment.description ?? '',
                date: data.appointment.start ? DateTime.fromISO(data.appointment.start).toJSDate() : undefined,
                time: data.appointment.start ? DateTime.fromISO(data.appointment.start).toFormat('HH:mm') : '',
                duration: data.appointment.duration,
            });
        }
    }, [data]);

    const isInputValid = () => {
        const newErrors: FormErrors = {};
        if (!updatedAppointment.date) {
            newErrors.date = t('appointment.errors.date');
        }

        const newStart = DateTime.fromISO(convertStartDate(updatedAppointment.date?.toISOString()!, updatedAppointment.time));
        const nowPlus5Minutes = DateTime.now().plus({ minutes: 5 });
        if (!updatedAppointment.time) {
            newErrors.time = t('appointment.errors.time');
        } else if (newStart < nowPlus5Minutes) {
            newErrors.time = t('appointment.errors.timeNotInFiveMin');
        }

        if (updatedAppointment.duration === 0) {
            newErrors.duration = t('appointment.errors.duration');
        }

        setErrors(newErrors);
        const hasErrors = Object.keys(newErrors).length > 0;
        return !hasErrors;
    };

    const [updateAppointment] = useMutation(
        gql(`
        mutation updateAppointment($appointmentToBeUpdated: AppointmentUpdateInput!) {
            appointmentUpdate(appointmentToBeUpdated: $appointmentToBeUpdated)
            }
    `),
        { refetchQueries: [PUPIL_APPOINTMENT, STUDENT_APPOINTMENT] }
    );

    const handleUpdateClick = async () => {
        if (isInputValid()) {
            const appointmentToBeUpdated: AppointmentUpdateInput = {
                id: updatedAppointment.id,
                title: updatedAppointment.title,
                description: updatedAppointment.description,
                start: convertStartDate(updatedAppointment.date?.toISOString()!, updatedAppointment.time),
                duration: updatedAppointment.duration,
            };
            try {
                setIsEditing(true);
                await updateAppointment({ variables: { appointmentToBeUpdated } });
                toast.success(t('appointment.editSuccess'));
                navigate(`/appointment/${updatedAppointment.id}`);
            } catch (error) {
                toast.error(t('error'));
            } finally {
                setIsEditing(false);
            }
        }
    };

    const getDefaultPreviousPath = () => {
        const apppointmentType = data?.appointment?.appointmentType;
        if (apppointmentType === Lecture_Appointmenttype_Enum.Match && data?.appointment?.matchId) {
            return `/match/${data?.appointment?.matchId}`;
        } else if (apppointmentType === Lecture_Appointmenttype_Enum.Group && data?.appointment?.subcourseId) {
            return `/single-course/${data?.appointment?.subcourseId}`;
        }
        return '/appointments';
    };

    const lectureNumber = t('appointment.appointmentTile.lecture', { position: data?.appointment?.position });
    const appointmentTile = data?.appointment?.title || lectureNumber;

    return (
        <>
            <Breadcrumb
                items={[
                    breadcrumbRoutes.APPOINTMENTS,
                    { label: data?.appointment?.displayName ?? '', route: getDefaultPreviousPath() },
                    { label: appointmentTile, route: `${breadcrumbRoutes.APPOINTMENT.route}/${appointmentId}` },
                    breadcrumbRoutes.EDIT_APPOINTMENT,
                ]}
                className="mb-4"
            />
            <div className="flex flex-1 flex-col justify-between lg:justify-start">
                {isLoading ? (
                    <CenterLoadingSpinner />
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-y-1">
                                <Label htmlFor="title">{t('appointment.create.titleLabel')}</Label>
                                <Input
                                    className="w-full"
                                    id="title"
                                    value={updatedAppointment.title}
                                    placeholder={lectureNumber}
                                    onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, title: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <Label htmlFor="date">{t('appointment.create.dateLabel')}</Label>
                                <DatePicker
                                    id="date"
                                    value={updatedAppointment.date}
                                    onChange={(date) => setUpdatedAppointment({ ...updatedAppointment, date })}
                                />
                                {errors.date && (
                                    <Typography variant="sm" className="text-red-500">
                                        {errors.date}
                                    </Typography>
                                )}
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <Label htmlFor="time">{t('appointment.create.timeLabel')}</Label>
                                <Input
                                    className="w-full"
                                    id="time"
                                    type="time"
                                    value={updatedAppointment.time}
                                    placeholder={lectureNumber}
                                    onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, time: e.target.value })}
                                />
                                {errors.time && (
                                    <Typography variant="sm" className="text-red-500">
                                        {errors.time}
                                    </Typography>
                                )}
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <Label htmlFor="duration">{t('appointment.create.durationLabel')}</Label>
                                <Select
                                    value={updatedAppointment.duration.toString()}
                                    onValueChange={(duration) => setUpdatedAppointment({ ...updatedAppointment, duration: Number(duration) })}
                                >
                                    <SelectTrigger id="duration" className="h-10 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">{t('course.selectOptions._15minutes')}</SelectItem>
                                        <SelectItem value="30">{t('course.selectOptions._30minutes')}</SelectItem>
                                        <SelectItem value="45">{t('course.selectOptions._45minutes')}</SelectItem>
                                        <SelectItem value="60">{t('course.selectOptions._1hour')}</SelectItem>
                                        <SelectItem value="90">{t('course.selectOptions._90minutes')}</SelectItem>
                                        <SelectItem value="120">{t('course.selectOptions._2hour')}</SelectItem>
                                        <SelectItem value="180">{t('course.selectOptions._3hour')}</SelectItem>
                                        <SelectItem value="240">{t('course.selectOptions._4hour')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.duration && (
                                    <Typography variant="sm" className="text-red-500">
                                        {errors.duration}
                                    </Typography>
                                )}
                            </div>
                            <div className="flex flex-col gap-y-1 lg:col-span-2">
                                <Label htmlFor="description">{t('appointment.create.descriptionLabel')}</Label>
                                <TextArea
                                    className="resize-none h-20 lg:h-20 w-full"
                                    id="description"
                                    value={updatedAppointment.description}
                                    onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, description: e.target.value })}
                                    placeholder={t('appointment.create.descriptionPlaceholder')}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4 mt-10">
                            <Button disabled={isEditing} onClick={() => navigate(-1)} variant="outline" className="w-full lg:w-fit">
                                {t('appointment.goBack')}
                            </Button>
                            <Button isLoading={isEditing} onClick={handleUpdateClick} className="w-full lg:w-fit">
                                {t('appointment.saveChanges')}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default AppointmentEdit;
