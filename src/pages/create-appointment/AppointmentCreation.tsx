import { useTranslation } from 'react-i18next';
import WeeklyAppointments from './WeeklyAppointments';
import AppointmentForm from './AppointmentForm';
import { useMutation } from '@apollo/client';
import { useCreateAppointment, useCreateCourseAppointments, useWeeklyAppointments } from '../../context/AppointmentContext';
import { FormReducerActionType, WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { AppointmentCreateGroupInput, AppointmentCreateMatchInput, Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { gql } from './../../gql';
import { calcNewAppointmentInOneWeek, convertStartDate, isDateMinOneWeekLater, isTimeMinFiveMinutesLater } from '../../helper/appointment-helper';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { Checkbox } from '@/components/Checkbox';
import { Label } from '@/components/Label';

export type FormErrors = {
    title?: string;
    date?: string;
    time?: string;
    duration?: string;
    description?: string;
    dateNotInOneWeek?: string;
    timeNotInFiveMin?: string;
    invalidLink?: string;
};

export type StartDate = {
    date: string;
    time: string;
};

export enum VideoChatTypeEnum {
    ZOOM = 'Zoom',
    LINK = 'Link',
}

type Props = {
    courseOrMatchId?: number;
    isCourse?: boolean;
    isCourseCreation?: boolean;
    appointmentsTotal?: number;
    overrideMeetingLink?: string;
    back: () => void;
    closeModal?: () => void;
    navigateToMatch?: () => Promise<void>;
    setIsLoading?: Dispatch<SetStateAction<boolean>>;
};

const AppointmentCreation: React.FC<Props> = ({
    back,
    courseOrMatchId,
    isCourse,
    isCourseCreation,
    appointmentsTotal,
    overrideMeetingLink,
    closeModal,
    navigateToMatch,
    setIsLoading,
}) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointment();
    const { appointmentsToBeCreated, setAppointmentsToBeCreated } = useCreateCourseAppointments();
    const { weeklies, dispatchWeeklyAppointment } = useWeeklyAppointments();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [dateSelected, setDateSelected] = useState<boolean>(false);
    const [timeSelected, setTimeSelected] = useState<boolean>(false);
    const [videoChatType, setVideoChatType] = useState<VideoChatTypeEnum>(VideoChatTypeEnum.ZOOM);

    const [createGroupAppointments] = useMutation(
        gql(`
        mutation appointmentsGroupCreate($appointments: [AppointmentCreateGroupInput!]!, $id: Float!) {
            appointmentsGroupCreate(appointments: $appointments, subcourseId: $id)
        }
    `)
    );

    const [createMatchAppointments] = useMutation(
        gql(`
        mutation appointmentsMatchCreate($appointments: [AppointmentCreateMatchInput!]!, $id: Float!) {
            appointmentsMatchCreate(appointments: $appointments, matchId: $id)
        }
    `)
    );

    const newOverrideMeetingLink = useMemo(() => {
        const meetingLink =
            videoChatType === VideoChatTypeEnum.ZOOM ? undefined : appointmentToCreate.meetingLink ? appointmentToCreate.meetingLink : overrideMeetingLink;
        return meetingLink;
    }, [appointmentToCreate.meetingLink, overrideMeetingLink, videoChatType]);

    const isValidUrl = (url?: string) => {
        // if the chat type is an override meeting link, the link shouldn't be undefined or null
        if (videoChatType === VideoChatTypeEnum.LINK && !url) {
            return false;
        }

        // the regex should check, if the passed url is a valid meeting url
        if (url) {
            const urlRegex = /^(https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)\.[a-zA-Z]{2,}(\/[^\s]*)?(?:\?[^\s]*)?$/;
            return urlRegex.test(url);
        }

        // if zoom is choosen no url must be given
        return true;
    };

    const validateInputs = () => {
        if (!appointmentToCreate.date) {
            setErrors({ ...errors, date: t('appointment.errors.date') });
            return false;
        } else {
            delete errors.date;
        }
        if ((isCourse || isCourseCreation) && !isDateMinOneWeekLater(appointmentToCreate.date)) {
            setErrors({ ...errors, dateNotInOneWeek: t('appointment.errors.dateMinOneWeek') });
            return false;
        } else {
            delete errors.date;
        }
        if (!isCourse && !isCourseCreation && !isTimeMinFiveMinutesLater(appointmentToCreate.date, appointmentToCreate.time)) {
            setErrors({ ...errors, timeNotInFiveMin: t('appointment.errors.timeNotInFiveMin') });
            return false;
        } else {
            delete errors.timeNotInFiveMin;
        }
        if (!appointmentToCreate.time.length) {
            setErrors({ ...errors, time: t('appointment.errors.time') });
            return false;
        } else {
            delete errors.time;
        }

        if (!isValidUrl(newOverrideMeetingLink)) {
            setErrors({ ...errors, invalidLink: 'invalid link' });
            return false;
        } else {
            delete errors.invalidLink;
        }

        if (appointmentToCreate.duration === 0) {
            setErrors({ ...errors, duration: t('appointment.errors.duration') });
            return false;
        } else {
            delete errors.duration;
        }
        return true;
    };
    const handleWeeklyCheck = () => {
        dispatchCreateAppointment({
            type: FormReducerActionType.TOGGLE_CHANGE,
            field: 'isRecurring',
        });
    };
    // * create appointments for a new course
    const handleCreateCourseAppointments = () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            setIsLoading && setIsLoading(true);
            const newAppointment: AppointmentCreateGroupInput = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                duration: appointmentToCreate.duration,
                meetingLink: newOverrideMeetingLink,
                subcourseId: courseOrMatchId!,
                appointmentType: Lecture_Appointmenttype_Enum.Group,
            };
            if (isCourseCreation && weeklies.length === 0) {
                setAppointmentsToBeCreated([...appointmentsToBeCreated, newAppointment]);
            } else if (isCourseCreation && weeklies.length > 0) {
                let weeklyAppointments: AppointmentCreateGroupInput[] = [];

                for (const weekly of weeklies) {
                    const newWeeklyAppointment = {
                        title: weekly.title ? weekly.title : '',
                        description: weekly.description ? weekly.description : '',
                        start: convertStartDate(weekly.nextDate, appointmentToCreate.time),
                        duration: appointmentToCreate.duration,
                        meetingLink: newOverrideMeetingLink,
                        subcourseId: courseOrMatchId!,
                        appointmentType: Lecture_Appointmenttype_Enum.Group,
                    };
                    weeklyAppointments.push(newWeeklyAppointment);
                }
                setAppointmentsToBeCreated([...appointmentsToBeCreated, newAppointment, ...weeklyAppointments]);
            }

            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });
            toast.success(weeklies.length > 0 ? t('appointment.toast.createAppointmentsSuccess') : t('appointment.toast.createOneAppointmentSuccess'));
            closeModal && closeModal();
        }
    };
    // * create appointments for an existing course
    const handleCreateCourseAppointment = async () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            setIsLoading && setIsLoading(true);
            let appointments: AppointmentCreateGroupInput[] = [];

            const newAppointment: AppointmentCreateGroupInput = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                duration: appointmentToCreate.duration,
                meetingLink: newOverrideMeetingLink,
                subcourseId: courseOrMatchId ? courseOrMatchId : 1,
                appointmentType: Lecture_Appointmenttype_Enum.Group,
            };

            appointments.push(newAppointment);

            if (weeklies.length > 0) {
                let weeklyAppointments: AppointmentCreateGroupInput[] = [];

                for (const weekly of weeklies) {
                    const newWeeklyAppointment = {
                        title: weekly.title ? weekly.title : '',
                        description: weekly.description ? weekly.description : '',
                        start: convertStartDate(weekly.nextDate, appointmentToCreate.time),
                        duration: appointmentToCreate.duration,
                        meetingLink: newOverrideMeetingLink,
                        subcourseId: courseOrMatchId ? courseOrMatchId : 1,
                        appointmentType: Lecture_Appointmenttype_Enum.Group,
                    };
                    weeklyAppointments.push(newWeeklyAppointment);
                }
                appointments.push(...weeklyAppointments);
            }

            await createGroupAppointments({ variables: { appointments, id: courseOrMatchId ? courseOrMatchId : 1 } });

            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });

            toast.success(weeklies.length > 0 ? t('appointment.toast.createAppointmentsSuccess') : t('appointment.toast.createOneAppointmentSuccess'));
            navigate('/appointments');
        }
    };
    // * create appointments for an existing match
    const handleCreateMatchAppointment = async () => {
        if (!appointmentToCreate) return;
        if (validateInputs()) {
            setIsLoading && setIsLoading(true);
            let appointments: AppointmentCreateMatchInput[] = [];

            const newAppointment: AppointmentCreateMatchInput = {
                title: appointmentToCreate.title ? appointmentToCreate.title : '',
                description: appointmentToCreate.description ? appointmentToCreate.description : '',
                start: convertStartDate(appointmentToCreate.date, appointmentToCreate.time),
                duration: appointmentToCreate.duration,
                meetingLink: newOverrideMeetingLink,
                matchId: courseOrMatchId ? courseOrMatchId : 1,
                appointmentType: Lecture_Appointmenttype_Enum.Match,
            };

            appointments.push(newAppointment);

            if (weeklies.length > 0) {
                let weeklyAppointments: AppointmentCreateMatchInput[] = [];

                for (const weekly of weeklies) {
                    const newWeeklyAppointment = {
                        title: weekly.title ? weekly.title : '',
                        description: weekly.description ? weekly.description : '',
                        start: convertStartDate(weekly.nextDate, appointmentToCreate.time),
                        duration: appointmentToCreate.duration,
                        meetingLink: newOverrideMeetingLink,
                        matchId: courseOrMatchId ? courseOrMatchId : 1,
                        appointmentType: Lecture_Appointmenttype_Enum.Match,
                    };
                    weeklyAppointments.push(newWeeklyAppointment);
                }
                appointments.push(...weeklyAppointments);
            }

            await createMatchAppointments({ variables: { appointments, id: courseOrMatchId ? courseOrMatchId : 1 } });

            dispatchCreateAppointment({ type: FormReducerActionType.CLEAR_DATA });
            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.CLEAR_WEEKLIES });

            toast.success(weeklies.length > 0 ? t('appointment.toast.createAppointmentsSuccess') : t('appointment.toast.createOneAppointmentSuccess'));

            if (navigateToMatch) {
                await navigateToMatch();
                setIsLoading && setIsLoading(false);
            } else {
                navigate('/appointments');
            }
        }
    };

    return (
        <div className="flex flex-col flex-1 justify-between">
            <div>
                <AppointmentForm
                    errors={errors}
                    onSetDate={() => {
                        setDateSelected(true);
                    }}
                    onSetTime={() => {
                        setTimeSelected(true);
                    }}
                    isCourse={isCourse ? isCourse : isCourseCreation ? isCourseCreation : false}
                    overrideMeetingLink={overrideMeetingLink}
                    setVideoChatType={setVideoChatType}
                    videoChatType={videoChatType}
                />
                {dateSelected && timeSelected && (
                    <div className="flex items-center py-2 gap-x-2">
                        <Checkbox id="weeklyRepeat" onCheckedChange={() => handleWeeklyCheck()} checked={appointmentToCreate.isRecurring} />
                        <Label htmlFor="weeklyRepeat">{t('appointment.create.weeklyRepeat')}</Label>
                    </div>
                )}
                {appointmentToCreate.isRecurring && (
                    <WeeklyAppointments appointmentsCount={appointmentsTotal ?? 0} nextDate={calcNewAppointmentInOneWeek(appointmentToCreate.date)} />
                )}
            </div>
            <div className="flex flex-col lg:flex-row gap-4 mt-5">
                <Button variant="outline" onClick={back} className="w-full lg:w-fit">
                    {t('appointment.create.backButton')}
                </Button>
                <Button
                    onClick={isCourseCreation ? handleCreateCourseAppointments : isCourse ? handleCreateCourseAppointment : handleCreateMatchAppointment}
                    className="w-full lg:w-fit"
                >
                    {t('appointment.create.addAppointmentButton')}
                </Button>
            </div>
        </div>
    );
};

export default AppointmentCreation;
