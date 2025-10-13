import { DisplayAppointment } from '@/widgets/AppointmentList';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { DatePicker } from '@/components/DatePicker';
import { DateTime } from 'luxon';
import { Typography } from '@/components/Typography';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import CustomVideoInput from '@/widgets/CustomVideoInput';
import { TextArea } from '@/components/TextArea';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { VideoChatTypeEnum } from '@/pages/create-appointment/AppointmentCreation';
import { Button } from '@/components/Button';

type Props = {
    appointmentPrefill: DisplayAppointment | undefined;
    onSubmit: (appointment: DisplayAppointment) => void;
    onCancel: () => void;
    errors: string[];
};

const CourseAppointmentForm: React.FC<Props> = ({ appointmentPrefill, onSubmit, onCancel, errors }) => {
    const { t } = useTranslation();

    const [title, setTitle] = useState(appointmentPrefill?.title ?? '');
    const [description, setDescription] = useState(appointmentPrefill?.description ?? '');
    const [date, setDate] = useState(
        appointmentPrefill?.start ? DateTime.fromISO(appointmentPrefill?.start).toISODate() : DateTime.now().plus({ days: 7 }).toISODate()
    );
    const [time, setTime] = useState(appointmentPrefill?.start ? DateTime.fromISO(appointmentPrefill?.start).toFormat('HH:mm') : '15:00');
    const [duration, setDuration] = useState(appointmentPrefill?.duration ?? 60);
    const [meetingLink, setMeetingLink] = useState(appointmentPrefill?.override_meeting_link ?? undefined);

    const [videoChatType, setVideoChatType] = useState<VideoChatTypeEnum>(
        appointmentPrefill?.override_meeting_link ? VideoChatTypeEnum.LINK : VideoChatTypeEnum.ZOOM
    );

    const handleTitleInput = (e: any) => {
        setTitle(e.target.value);
    };

    const handleDurationSelection = (e: any) => {
        setDuration(parseFloat(e));
    };

    const handleDescriptionInput = (e: any) => {
        setDescription(e);
    };

    const handleDateInput = (value: Date | undefined) => {
        if (value) {
            const newValue = DateTime.fromJSDate(value).toISODate();
            setDate(newValue);
        }
    };

    const handleTimeInput = (e: any) => {
        setTime(e.target.value);
    };

    const handleVideoInput = (e: any) => {
        setMeetingLink(e.target.value);
    };

    const minDate = DateTime.now().plus({ days: 7 });

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="date">{t('appointment.create.dateLabel')}</Label>
                    <DatePicker
                        id="date"
                        value={date ? DateTime.fromISO(date).toJSDate() : undefined}
                        onChange={handleDateInput}
                        disabled={{ before: minDate.toJSDate() }}
                    />
                    {errors && errors.includes('date') && (
                        <Typography variant="sm" className="text-red-500 error">
                            {t('appointment.create.emptyDateError')}
                        </Typography>
                    )}
                    {errors && errors.includes('dateNotInOneWeek') && (
                        <Typography variant="sm" className="text-red-500 error">
                            {t('appointment.create.wrongDateError')}
                        </Typography>
                    )}
                </div>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="time">{t('appointment.create.timeLabel')}</Label>
                    <Input
                        className="w-full"
                        id="time"
                        type="time"
                        value={time}
                        defaultValue={time}
                        onChange={handleTimeInput}
                        min={minDate.toFormat('HH:mm')}
                    />
                    {errors && errors.includes('time') && (
                        <Typography variant="sm" className="text-red-500 error">
                            {t('appointment.create.emptyTimeError')}
                        </Typography>
                    )}
                    {errors && errors.includes('timeNotInFiveMin') && (
                        <Typography variant="sm" className="text-red-500 error">
                            {t('appointment.errors.timeNotInFiveMin')}
                        </Typography>
                    )}
                </div>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="duration">{t('appointment.create.durationLabel')}</Label>
                    <Select value={duration.toString()} defaultValue="60" onValueChange={handleDurationSelection}>
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
                    {errors && errors.includes('duration') && (
                        <Typography variant="sm" className="text-red-500 error">
                            {t('appointment.create.emptySelectError')}
                        </Typography>
                    )}
                </div>
                <div className="flex flex-col gap-y-1 flex-1">
                    <Label htmlFor="videoChat">{t('appointment.create.videoChatLabel')}</Label>
                    <CustomVideoInput
                        inputValue={meetingLink}
                        handleInput={handleVideoInput}
                        overrideMeetingLink={meetingLink}
                        setVideoChatType={setVideoChatType}
                        videoChatType={videoChatType}
                    />
                    {errors && errors.includes('invalidLink') && (
                        <Typography variant="sm" className="text-red-500 error">
                            {t('appointment.create.wrongVideoUrlError')}
                        </Typography>
                    )}
                </div>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="title">{t('appointment.create.titleLabel')}</Label>
                    <Input className="w-full" id="title" value={title} placeholder={t('appointment.create.inputPlaceholder')} onChange={handleTitleInput} />
                </div>
                <div className="flex flex-col gap-y-1 flex-1 lg:col-span-2">
                    <Label htmlFor="description">{t('appointment.create.descriptionLabel')}</Label>
                    <TextArea
                        id="description"
                        value={description}
                        onChange={(e) => handleDescriptionInput(e.target.value)}
                        placeholder={t('appointment.create.descriptionPlaceholder')}
                    />
                </div>
            </div>
            <div className="flex w-full gap-x-5 mt-4">
                <Button onClick={onCancel} variant={'outline'} className="flex-grow">
                    {t('cancel')}
                </Button>
                <Button
                    onClick={() =>
                        onSubmit({
                            title,
                            description,
                            start: DateTime.fromISO(date)
                                .set({ hour: parseInt(time.split(':')[0]), minute: parseInt(time.split(':')[1]) })
                                .toISO(),
                            override_meeting_link: meetingLink,
                            duration,
                            isNew: appointmentPrefill?.isNew,
                            newId: appointmentPrefill?.newId,
                            id: !appointmentPrefill?.isNew ? appointmentPrefill!.id : -1, // -1 indicates a new appointment
                        })
                    }
                    className="flex-grow"
                >
                    {t('appointment.create.save')}
                </Button>
            </div>
        </div>
    );
};

export default CourseAppointmentForm;
