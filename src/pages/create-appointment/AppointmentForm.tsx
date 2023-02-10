import { Box, FormControl, HStack, Select, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import { useCreateAppointments } from '../../context/AppointmentContext';
import { FormReducerActionType } from '../../context/CreateAppointment';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InputSuffix from '../../widgets/InputSuffix';

const AppointmentForm: React.FC = () => {
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
        dispatchCreateAppointment({ type: FormReducerActionType.DATE_CHANGE, field: 'time', value: e.target.value });
    };

    return (
        <Box>
            {isMobile ? (
                <VStack>
                    {/* TITLE */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.titleLabel')}</FormControl.Label>
                        <InputSuffix appointmentLength={5} handleInput={handleTitleInput} />
                        <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>{t('appointment.create.emptyFieldError')}</FormControl.ErrorMessage>
                    </FormControl>

                    {/* DATE */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                        <DatePicker onChange={(e) => handleDateInput(e)} />
                    </FormControl>

                    {/* TIME */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                        <Box width="full">
                            <DatePicker type="time" onChange={(e) => handleTimeInput(e)} />
                        </Box>
                    </FormControl>

                    {/* DURATION */}
                    <FormControl>
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
                    </FormControl>

                    {/* DESCRIPTION */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.descriptionLabel')}</FormControl.Label>
                        <TextArea
                            // value={appointmentToCreate.description}
                            onChangeText={(e) => handleDescriptionInput(e)}
                            placeholder={t('appointment.create.descriptionPlaceholder')}
                            _light={{ placeholderTextColor: 'primary.500' }}
                            autoCompleteType={'normal'}
                            h="100"
                        />
                    </FormControl>
                </VStack>
            ) : (
                <HStack space={5} width="full">
                    <VStack space={2} width={isMobile ? 'full' : '50%'}>
                        {/* TITLE */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.titleLabel')}</FormControl.Label>
                            <InputSuffix appointmentLength={5} handleInput={handleTitleInput} />
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyFieldError')}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        {/* TIME */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                            <Box width="full">
                                <DatePicker type="time" onChange={(e) => handleTimeInput(e)} />
                            </Box>
                        </FormControl>

                        {/* DESCRIPTION */}
                        <FormControl>
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
                    </VStack>
                    <VStack space={2} width={isMobile ? 'full' : '50%'}>
                        {/* DATE */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                            <DatePicker onChange={(e) => handleDateInput(e)} />
                        </FormControl>

                        {/* DURATION */}
                        <FormControl>
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
                    </VStack>
                </HStack>
            )}
        </Box>
    );
};

export default AppointmentForm;
