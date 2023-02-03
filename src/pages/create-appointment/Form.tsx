import { Box, FormControl, HStack, Select, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import { useCreateAppointments } from '../../hooks/useCreateAppointment';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InputSuffix from '../../widgets/InputSuffix';

const Form: React.FC = () => {
    const { newAppointment, setNewAppoinment } = useCreateAppointments();

    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const handleInput = (e: any) => {
        setNewAppoinment({ ...newAppointment, title: e.target.value });
    };

    return (
        <Box>
            {isMobile ? (
                <VStack>
                    {/* TITLE */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.titleLabel')}</FormControl.Label>
                        <InputSuffix appointmentLength={5} handleInput={handleInput} />
                        <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>{t('appointment.create.emptyFieldError')}</FormControl.ErrorMessage>
                    </FormControl>

                    {/* DATE */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                        <DatePicker onChange={(e) => setNewAppoinment({ ...newAppointment, start: `${e.target.value}T` })} />
                    </FormControl>

                    {/* TIME */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                        <Box width="full">
                            <DatePicker
                                type="time"
                                onChange={(e) => setNewAppoinment({ ...newAppointment, start: newAppointment.start + `${e.target.value}:00Z` })}
                            />
                        </Box>
                    </FormControl>

                    {/* DURATION */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.durationLabel')}</FormControl.Label>
                        <Select onValueChange={(e) => setNewAppoinment({ ...newAppointment, duration: e })}>
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
                            value={newAppointment.description}
                            onChangeText={(e) => setNewAppoinment({ ...newAppointment, description: e })}
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
                            <InputSuffix appointmentLength={5} handleInput={handleInput} />
                            <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                                {t('appointment.create.emptyFieldError')}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        {/* TIME */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                            <Box width="full">
                                <DatePicker type="time" onChange={(e) => setNewAppoinment({ ...newAppointment, time: e.target.value })} />
                            </Box>
                        </FormControl>

                        {/* DESCRIPTION */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.descriptionLabel')}</FormControl.Label>
                            <TextArea
                                onChangeText={(e) => setNewAppoinment({ ...newAppointment, description: e })}
                                _light={{ placeholderTextColor: 'primary.500' }}
                                autoCompleteType={'normal'}
                                h="100"
                            />
                        </FormControl>
                    </VStack>
                    <VStack space={2} width={isMobile ? 'full' : '50%'}>
                        {/* DATE */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                            <DatePicker onChange={(e) => setNewAppoinment({ ...newAppointment, start: e.target.value })} />
                        </FormControl>

                        {/* DURATION */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.durationLabel')}</FormControl.Label>
                            <Select onValueChange={(e) => setNewAppoinment({ ...newAppointment, duration: e })}>
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

export default Form;
