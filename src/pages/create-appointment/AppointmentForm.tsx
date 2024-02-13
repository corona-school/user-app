import { Box, FormControl, Select, Stack, TextArea, useBreakpointValue, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import { useCreateAppointment } from '../../context/AppointmentContext';
import { FormReducerActionType } from '../../types/lernfair/CreateAppointment';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InputSuffix from '../../widgets/InputSuffix';
import { useCallback, useState } from 'react';
import { FormErrors } from './AppointmentCreation';
import { isDateToday } from '../../helper/appointment-helper';
import { DateTime } from 'luxon';
import CustomSelect from '../../components/CustomSelect';
import CustomVideoInput from '../../widgets/CustomVideoInput';

type FormProps = {
    errors: FormErrors;
    appointmentsCount: number;
    overrideMeetingLink: string | undefined;
    onSetDate: () => void;
    onSetTime: () => void;
    setVideoChatType: (type: string) => void;
    videoChatType: string;
    isCourse: boolean;
};
const AppointmentForm: React.FC<FormProps> = ({
    errors,
    appointmentsCount,
    onSetDate,
    overrideMeetingLink,
    onSetTime,
    isCourse,
    setVideoChatType,
    videoChatType,
}) => {
    const { dispatchCreateAppointment } = useCreateAppointment();
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const inputWidth = useBreakpointValue({
        base: 'full',
        lg: '50%',
    });

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [meetingLink, setMeetingLink] = useState(overrideMeetingLink ?? '');
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

    const handleDateInput = (e: any) => {
        setDate(e.target.value);
        onSetDate();
    };

    const handleDateBlur = () => {
        dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'date', value: date });
        setIsToday(isDateToday(date));
    };

    const handleTimeInput = (e: any) => {
        setTime(e.target.value);
        onSetTime();
    };

    const handleVideoInput = (e: any) => {
        setMeetingLink(e.target.value);
    };
    const clearVideoInput = () => {
        setMeetingLink('');
    };

    const getMinForDatePicker = useCallback((type: 'date' | 'time', isCourse: boolean, isToday: boolean) => {
        let date = DateTime.now();
        if (type === 'date') {
            if (isCourse) date = date.plus({ days: 7 });
            return date.toFormat('yyyy-MM-dd');
        }

        if (type === 'time') {
            if (!isCourse && isToday) date = date.plus({ minutes: 5 });
            return date.toFormat('HH:mm');
        }
        return undefined;
    }, []);

    console.log('ERRORs', errors);

    return (
        <Box>
            <VStack space={1} width="full">
                {/* TITLE */}
                <Stack direction={isMobile ? 'column' : 'row'} space={5}>
                    <FormControl width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.titleLabel')}</FormControl.Label>
                        <InputSuffix
                            appointmentsCount={appointmentsCount + 1}
                            inputValue={title}
                            handleInput={handleTitleInput}
                            handleBlur={() => dispatchCreateAppointment({ type: FormReducerActionType.TEXT_CHANGE, field: 'title', value: title })}
                        />
                    </FormControl>
                    {/* DATE */}
                    <FormControl isInvalid={'date' in errors || 'dateNotInOneWeek' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                        <DatePicker
                            onChange={(e) => handleDateInput(e)}
                            value={date}
                            onBlur={handleDateBlur}
                            min={getMinForDatePicker('date', isCourse, isToday)}
                        />
                        {'date' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyDateError')}
                            </FormControl.ErrorMessage>
                        )}
                        {'dateNotInOneWeek' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.wrongDateError')}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>
                </Stack>
                <Stack direction={isMobile ? 'column' : 'row'} space={5}>
                    {/* TIME */}
                    <FormControl isInvalid={'time' in errors || 'timeNotInFiveMin' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                        <Box width="full">
                            <DatePicker
                                type="time"
                                onChange={(e) => handleTimeInput(e)}
                                value={time}
                                onBlur={() => dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'time', value: time })}
                                min={getMinForDatePicker('time', isCourse, isToday)}
                            />
                        </Box>
                        {'time' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyTimeError')}
                            </FormControl.ErrorMessage>
                        )}
                        {'timeNotInFiveMin' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.errors.timeNotInFiveMin')}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    {/* DURATION */}
                    <FormControl isInvalid={'duration' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.durationLabel')}</FormControl.Label>
                        <CustomSelect placeholder="Dauer der Unterrichtseinheit" onValueChange={(duration: string) => handleDurationSelection(duration)}>
                            <Select.Item value="15" label={t('course.selectOptions._15minutes')} />
                            <Select.Item value="30" label={t('course.selectOptions._30minutes')} />
                            <Select.Item value="45" label={t('course.selectOptions._45minutes')} />
                            <Select.Item value="60" label={t('course.selectOptions._1hour')} />
                            <Select.Item value="90" label={t('course.selectOptions._90minutes')} />
                            <Select.Item value="120" label={t('course.selectOptions._2hour')} />
                            <Select.Item value="180" label={t('course.selectOptions._3hour')} />
                            <Select.Item value="240" label={t('course.selectOptions._4hour')} />
                        </CustomSelect>
                        {'duration' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptySelectError')}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>
                </Stack>

                <Stack direction={isMobile ? 'column' : 'row'} space={5}>
                    <FormControl isInvalid={'videoChat' in errors} width={inputWidth}>
                        {/* VIDEO CHAT */}
                        <FormControl.Label>{t('appointment.create.videoChatLabel')}</FormControl.Label>
                        <CustomVideoInput
                            inputValue={meetingLink}
                            handleInput={handleVideoInput}
                            handleBlur={() => {
                                dispatchCreateAppointment({ type: FormReducerActionType.TEXT_CHANGE, field: 'meetingLink', value: meetingLink });
                            }}
                            clearInput={clearVideoInput}
                            overrideMeetingLink={overrideMeetingLink}
                            setVideoChatType={setVideoChatType}
                            videoChatType={videoChatType}
                        />
                        {'videoChat' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>Bitte wähle ein Videochat.</FormControl.ErrorMessage>
                        )}
                    </FormControl>
                </Stack>

                <Stack direction={isMobile ? 'column' : 'row'} space={5}>
                    {/* DESCRIPTION */}
                    <FormControl isInvalid={'description' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.descriptionLabel')}</FormControl.Label>
                        <TextArea
                            value={description}
                            onChangeText={(e) => handleDescriptionInput(e)}
                            onBlur={() => dispatchCreateAppointment({ type: FormReducerActionType.TEXT_CHANGE, field: 'description', value: description })}
                            placeholder={t('appointment.create.descriptionPlaceholder')}
                            autoCompleteType={'normal'}
                            h="100"
                        />
                    </FormControl>
                </Stack>
            </VStack>
        </Box>
    );
};

export default AppointmentForm;
