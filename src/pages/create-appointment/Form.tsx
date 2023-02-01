import { Box, FormControl, HStack, Select, Stack, TextArea, VStack, WarningTwoIcon } from 'native-base';
import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InputSuffix from '../../widgets/InputSuffix';

type FormProps = {};
const reducer = (appointment: any, newData: any) => {
    console.log('REDUCER: appointment', appointment, 'new Data', newData);
    return {
        ...newData,
    };
};
const Form: React.FC<FormProps> = ({}) => {
    const [appointmentData, setAppointmentData] = useReducer(reducer, {});
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const handleInput = (e: any) => {
        setAppointmentData({ title: e.target.value });
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
                        <DatePicker onChange={(e) => setAppointmentData({ ...appointmentData, start: e.target.value })} />
                    </FormControl>

                    {/* TIME */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                        <Box width="full">
                            <DatePicker type="time" onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })} />
                        </Box>
                    </FormControl>

                    {/* DURATION */}
                    <FormControl>
                        <FormControl.Label>{t('appointment.create.durationLabel')}</FormControl.Label>
                        <Select onValueChange={(e) => setAppointmentData({ ...appointmentData, duration: e })}>
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
                            onChangeText={(e) => setAppointmentData({ ...appointmentData, description: e })}
                            placeholder={t('appointment.create.descriptionPlaceholder')}
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
                                <DatePicker type="time" onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })} />
                            </Box>
                        </FormControl>

                        {/* DESCRIPTION */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.descriptionLabel')}</FormControl.Label>
                            <TextArea
                                onChangeText={(e) => setAppointmentData({ ...appointmentData, description: e })}
                                placeholder={t('appointment.create.descriptionPlaceholder')}
                                autoCompleteType={'normal'}
                                h="100"
                            />
                        </FormControl>
                    </VStack>
                    <VStack space={2} width={isMobile ? 'full' : '50%'}>
                        {/* DATE */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                            <DatePicker onChange={(e) => setAppointmentData({ ...appointmentData, start: e.target.value })} />
                        </FormControl>

                        {/* DURATION */}
                        <FormControl>
                            <FormControl.Label>{t('appointment.create.durationLabel')}</FormControl.Label>
                            <Select onValueChange={(e) => setAppointmentData({ ...appointmentData, duration: e })}>
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
