import { Box, FormControl, Select, Stack, TextArea, useBreakpointValue, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import { useCreateAppointments } from '../../context/AppointmentContext';
import { FormReducerActionType } from '../../context/CreateAppointment';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InputSuffix from '../../widgets/InputSuffix';

type FormProps = {
    errors: {};
    appointmentsCount: number;
};
const AppointmentForm: React.FC<FormProps> = ({ errors, appointmentsCount }) => {
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointments();
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const inputWidth = useBreakpointValue({
        base: 'full',
        lg: '50%',
    });

    const handleTitleInput = (e: any) => {
        dispatchCreateAppointment({ type: FormReducerActionType.TEXT_CHANGE, field: 'title', value: e.target.value });
    };

    const handleDurationSelection = (e: any) => {
        dispatchCreateAppointment({ type: FormReducerActionType.SELECT_CHANGE, field: 'duration', value: e });
    };

    const handleDescriptionInput = (e: any) => {
        dispatchCreateAppointment({ type: FormReducerActionType.TEXT_CHANGE, field: 'description', value: e });
    };

    const handleDateInput = (e: any) => {
        dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'date', value: e.target.value });
    };

    const handleTimeInput = (e: any) => {
        dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'time', value: e.target.value });
    };

    return (
        <Box>
            <VStack space={5} width="full">
                <Stack direction={isMobile ? 'column' : 'row'} space={5}>
                    {/* TITLE */}
                    <FormControl isInvalid={'title' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.titleLabel')}</FormControl.Label>
                        <InputSuffix appointmentsCount={appointmentsCount + 1} inputValue={appointmentToCreate.title} handleInput={handleTitleInput} />
                        {'title' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyFieldError')}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    {/* DATE */}
                    <FormControl isInvalid={'date' in errors || 'dateNotInOneWeek' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                        <DatePicker onChange={(e) => handleDateInput(e)} value={appointmentToCreate.date} />
                        {'date' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyDateError')}
                            </FormControl.ErrorMessage>
                        )}
                        {'dateNotInOneWeek' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>Datum muss in 7 Tagen sein</FormControl.ErrorMessage>
                        )}
                    </FormControl>
                </Stack>

                <Stack direction={isMobile ? 'column' : 'row'} space={5}>
                    {/* TIME */}
                    <FormControl isInvalid={'time' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                        <Box width="full">
                            <DatePicker type="time" onChange={(e) => handleTimeInput(e)} value={appointmentToCreate.time} min={'08:00'} />
                        </Box>
                        {'time' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyTimeError')}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    {/* DURATION */}
                    <FormControl isInvalid={'duration' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.durationLabel')}</FormControl.Label>
                        <Select placeholder="Dauer der Unterrichtseinheit" onValueChange={(e) => handleDurationSelection(e)}>
                            <Select.Item value="15" label={t('course.selectOptions._15minutes')} />
                            <Select.Item value="30" label={t('course.selectOptions._30minutes')} />
                            <Select.Item value="45" label={t('course.selectOptions._45minutes')} />
                            <Select.Item value="60" label={t('course.selectOptions._1hour')} />
                            <Select.Item value="90" label={t('course.selectOptions._90minutes')} />
                            <Select.Item value="120" label={t('course.selectOptions._2hour')} />
                            <Select.Item value="180" label={t('course.selectOptions._3hour')} />
                            <Select.Item value="240" label={t('course.selectOptions._4hour')} />
                        </Select>
                        {'duration' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptySelectError')}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>
                </Stack>

                {/* DESCRIPTION */}
                <FormControl isInvalid={'description' in errors} width={inputWidth}>
                    <FormControl.Label>{t('appointment.create.descriptionLabel')}</FormControl.Label>
                    <TextArea
                        value={appointmentToCreate.description}
                        onChangeText={(e) => handleDescriptionInput(e)}
                        placeholder={t('appointment.create.descriptionPlaceholder')}
                        _light={{ placeholderTextColor: 'primary.500' }}
                        autoCompleteType={'normal'}
                        h="100"
                    />
                </FormControl>
            </VStack>
        </Box>
    );
};

export default AppointmentForm;
