import { Box, FormControl, HStack, Select, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import { useCreateAppointments } from '../../context/AppointmentContext';
import { FormReducerActionType } from '../../context/CreateAppointment';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InputSuffix from '../../widgets/InputSuffix';

type FormProps = {
    errors: {};
};
const AppointmentForm: React.FC<FormProps> = ({ errors }) => {
    const { appointmentToCreate, dispatchCreateAppointment } = useCreateAppointments();

    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

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
        console.log('time type', typeof e.target.value);
        dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'time', value: e.target.value });
    };

    return (
        <Box>
            {isMobile ? (
                <VStack>
                    {/* TITLE */}
                    <FormControl isInvalid={'title' in errors}>
                        <FormControl.Label>{t('appointment.create.titleLabel')}</FormControl.Label>
                        <InputSuffix appointmentLength={5} inputValue={appointmentToCreate.title} handleInput={handleTitleInput} />
                        {'title' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyFieldError')}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    {/* DATE */}
                    <FormControl isInvalid={'date' in errors}>
                        <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                        <DatePicker onChange={(e) => handleDateInput(e)} value={appointmentToCreate.date} />
                        {'date' in errors && (
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyDateError')}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    {/* TIME */}
                    <FormControl isInvalid={'time' in errors}>
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
                    <FormControl isInvalid={'duration' in errors}>
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

                    {/* DESCRIPTION */}
                    <FormControl isInvalid={'description' in errors}>
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
            ) : (
                <VStack space={5} width="full">
                    <HStack space={5}>
                        {/* TITLE */}
                        <FormControl width={'50%'}>
                            <FormControl.Label>{t('appointment.create.titleLabel')}</FormControl.Label>
                            <InputSuffix appointmentLength={5} handleInput={handleTitleInput} />
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyFieldError')}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        {/* DATE */}
                        <FormControl width={'50%'}>
                            <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                            <DatePicker onChange={(e) => handleDateInput(e)} />
                        </FormControl>
                    </HStack>
                    <HStack space={5}>
                        {/* TIME */}
                        <FormControl width={'50%'}>
                            <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                            <Box width="full">
                                <DatePicker type="time" onChange={(e) => handleTimeInput(e)} />
                            </Box>
                        </FormControl>
                        {/* DURATION */}
                        <FormControl width={'50%'}>
                            <FormControl.Label>{t('appointment.create.durationLabel')}</FormControl.Label>
                            <Select placeholder="Dauer der Unterrichtseinheit" placeholderTextColor="#82B1B0" onValueChange={(e) => handleDurationSelection(e)}>
                                <Select.Item value="15" label={t('course.selectOptions._15minutes')} />
                                <Select.Item value="30" label={t('course.selectOptions._30minutes')} />
                                <Select.Item value="45" label={t('course.selectOptions._45minutes')} />
                                <Select.Item value="60" label={t('course.selectOptions._1hour')} />
                                <Select.Item value="90" label={t('course.selectOptions._90minutes')} />
                                <Select.Item value="120" label={t('course.selectOptions._2hour')} />
                                <Select.Item value="180" label={t('course.selectOptions._3hour')} />
                                <Select.Item value="240" label={t('course.selectOptions._4hour')} />
                            </Select>
                        </FormControl>
                    </HStack>
                    <HStack space={5}>
                        {/* DESCRIPTION */}
                        <FormControl width={'50%'}>
                            <FormControl.Label>{t('appointment.create.descriptionLabel')}</FormControl.Label>
                            <TextArea
                                placeholder="Füge eine prägnante und verständliche Beschreibung hinzu"
                                _light={{
                                    placeholderTextColor: '#82B1B0',
                                }}
                                onChangeText={(e) => handleDescriptionInput(e)}
                                autoCompleteType={'normal'}
                                h="100"
                            />
                        </FormControl>
                    </HStack>
                </VStack>
            )}
        </Box>
    );
};

export default AppointmentForm;
