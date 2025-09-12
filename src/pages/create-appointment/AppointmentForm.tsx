import { useTranslation } from 'react-i18next';
import { useCreateAppointment } from '../../context/AppointmentContext';
import { FormReducerActionType } from '../../types/lernfair/CreateAppointment';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { FormErrors, VideoChatTypeEnum } from './AppointmentCreation';
import { isDateToday } from '../../helper/appointment-helper';
import { DateTime } from 'luxon';
import CustomVideoInput from '../../widgets/CustomVideoInput';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';
import { DatePicker } from '@/components/DatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { TextArea } from '@/components/TextArea';
import AddTimeWithTooltip from '@/components/ToolTipTimeZone';

type FormProps = {
    errors: FormErrors;
    overrideMeetingLink: string | undefined;
    onSetDate: () => void;
    onSetTime: () => void;
    setVideoChatType: Dispatch<SetStateAction<VideoChatTypeEnum>>;
    videoChatType: string;
    isCourse: boolean;
    defaultDate?: string;
    defaultTime?: string;
};

const AppointmentForm: React.FC<FormProps> = ({
    errors,
    onSetDate,
    overrideMeetingLink,
    onSetTime,
    isCourse,
    setVideoChatType,
    videoChatType,
    defaultDate,
    defaultTime,
}) => {
    const { dispatchCreateAppointment, appointmentToCreate } = useCreateAppointment();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('15:00');
    const [meetingLink, setMeetingLink] = useState(overrideMeetingLink ?? undefined);
    const [isToday, setIsToday] = useState<boolean>(false);

    const handleTitleInput = (e: any) => {
        setTitle(e.target.value);
    };

    const handleDurationSelection = (e: any) => {
        dispatchCreateAppointment({ type: FormReducerActionType.SELECT_CHANGE, field: 'duration', value: parseFloat(e) });
    };

    const handleDescriptionInput = (e: any) => {
        setDescription(e);
    };

    const handleDateInput = (value: Date | undefined) => {
        if (value) {
            const newValue = DateTime.fromJSDate(value).toISODate();
            dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'date', value: newValue });
            setIsToday(isDateToday(newValue));
            setDate(newValue);
            onSetDate();
        }
    };

    const handleTimeInput = (e: any) => {
        setTime(e.target.value);
        onSetTime();
    };

    const handleVideoInput = (e: any) => {
        setMeetingLink(e.target.value);
    };

    const getMinForDatePicker = useCallback((type: 'date' | 'time', isCourse: boolean, isToday: boolean) => {
        let date = DateTime.now();
        if (type === 'date') {
            if (isCourse) date = date.plus({ days: 7 });
            return date;
        }

        if (!isCourse && isToday) date = date.plus({ minutes: 5 });
        return date;
    }, []);

    const minDate = getMinForDatePicker('date', isCourse, isToday).toJSDate();

    useEffect(() => {
        if (defaultDate) {
            const parsedDate = DateTime.fromISO(defaultDate);
            handleDateInput(parsedDate.toJSDate());
        }
        if (defaultTime) {
            handleTimeInput({ target: { value: defaultTime } });
            dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'time', value: defaultTime });
        }
    }, [defaultDate, defaultTime]);

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="title">{t('appointment.create.titleLabel')}</Label>
                    <Input
                        className="w-full"
                        id="title"
                        value={title}
                        placeholder={t('appointment.create.inputPlaceholder')}
                        onChange={handleTitleInput}
                        onBlur={() => dispatchCreateAppointment({ type: FormReducerActionType.TEXT_CHANGE, field: 'title', value: title })}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="date">{t('appointment.create.dateLabel')}</Label>
                    <DatePicker
                        id="date"
                        value={date ? DateTime.fromISO(date).toJSDate() : undefined}
                        onChange={handleDateInput}
                        disabled={{ before: minDate }}
                    />
                    {'date' in errors && (
                        <Typography variant="sm" className="text-red-500">
                            {t('appointment.create.emptyDateError')}
                        </Typography>
                    )}
                    {'dateNotInOneWeek' in errors && (
                        <Typography variant="sm" className="text-red-500">
                            {t('appointment.create.wrongDateError')}
                        </Typography>
                    )}
                </div>
                <div className="flex flex-col gap-y-1">
                    <AddTimeWithTooltip />
                    <Input
                        className="w-full"
                        id="time"
                        type="time"
                        value={time}
                        defaultValue={time}
                        onChange={handleTimeInput}
                        onBlur={() => dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'time', value: time })}
                        min={getMinForDatePicker('time', isCourse, isToday).toFormat('HH:mm')}
                    />
                    {'time' in errors && (
                        <Typography variant="sm" className="text-red-500">
                            {t('appointment.create.emptyTimeError')}
                        </Typography>
                    )}
                    {'timeNotInFiveMin' in errors && (
                        <Typography variant="sm" className="text-red-500">
                            {t('appointment.errors.timeNotInFiveMin')}
                        </Typography>
                    )}
                </div>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="duration">{t('appointment.create.durationLabel')}</Label>
                    <Select value={appointmentToCreate.duration.toString()} defaultValue="60" onValueChange={handleDurationSelection}>
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
                    {'duration' in errors && (
                        <Typography variant="sm" className="text-red-500">
                            {t('appointment.create.emptySelectError')}
                        </Typography>
                    )}
                </div>
                <div className="flex flex-col gap-y-1 flex-1">
                    <Label htmlFor="videoChat">{t('appointment.create.videoChatLabel')}</Label>
                    <CustomVideoInput
                        inputValue={meetingLink}
                        handleInput={handleVideoInput}
                        handleBlur={() => {
                            dispatchCreateAppointment({ type: FormReducerActionType.TEXT_CHANGE, field: 'meetingLink', value: meetingLink });
                        }}
                        overrideMeetingLink={overrideMeetingLink}
                        setVideoChatType={setVideoChatType}
                        videoChatType={videoChatType}
                    />
                    {'invalidLink' in errors && (
                        <Typography variant="sm" className="text-red-500">
                            {t('appointment.create.wrongVideoUrlError')}
                        </Typography>
                    )}
                </div>
                <div className="flex flex-1"></div>
                <div className="flex flex-col gap-y-1 flex-1 lg:col-span-2">
                    <Label htmlFor="description">{t('appointment.create.descriptionLabel')}</Label>
                    <TextArea
                        id="description"
                        value={description}
                        onChange={(e) => handleDescriptionInput(e.target.value)}
                        onBlur={() => dispatchCreateAppointment({ type: FormReducerActionType.TEXT_CHANGE, field: 'description', value: description })}
                        placeholder={t('appointment.create.descriptionPlaceholder')}
                    />
                </div>
            </div>
        </div>
    );
};

export default AppointmentForm;
