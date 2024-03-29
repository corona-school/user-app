import { Box, FormControl, Select, Stack, TextArea, useBreakpointValue, VStack, WarningTwoIcon } from 'native-base';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InputSuffix from '../../widgets/InputSuffix';
import { UpdateAppointment } from './AppointmentEdit';
import { DateTime } from 'luxon';

type EditProps = {
    errors: {};
    appointmentsCount: number;
    updatedAppointment: UpdateAppointment;
    setUpdatedAppointment: Dispatch<SetStateAction<UpdateAppointment>>;
};

const AppointmentEditForm: React.FC<EditProps> = ({ errors, appointmentsCount, updatedAppointment, setUpdatedAppointment }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const inputWidth = useBreakpointValue({
        base: 'full',
        lg: '50%',
    });

    return (
        <Box>
            <VStack space={5} width="full">
                <Stack direction={isMobile ? 'column' : 'row'} space={5}>
                    {/* TITLE */}
                    <FormControl width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.titleLabel')}</FormControl.Label>
                        <InputSuffix
                            appointmentsCount={appointmentsCount}
                            inputValue={updatedAppointment.title}
                            handleInput={(e) => {
                                setUpdatedAppointment({ ...updatedAppointment, title: e.target.value });
                            }}
                        />
                    </FormControl>

                    {/* DATE */}
                    <FormControl isInvalid={'date' in errors || 'dateNotInOneWeek' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.dateLabel')}</FormControl.Label>
                        <DatePicker
                            value={updatedAppointment.date}
                            onChange={(e) => {
                                setUpdatedAppointment({ ...updatedAppointment, date: e.target.value });
                            }}
                            min={DateTime.now().toISODate()}
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
                    <FormControl isInvalid={'time' in errors} width={inputWidth}>
                        <FormControl.Label>{t('appointment.create.timeLabel')}</FormControl.Label>
                        <Box width="full">
                            <DatePicker
                                value={updatedAppointment.time}
                                type="time"
                                onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, time: e.target.value })}
                                min={'08:00'}
                            />
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
                        <Select
                            placeholder="Dauer der Unterrichtseinheit"
                            onValueChange={(e) => setUpdatedAppointment({ ...updatedAppointment, duration: parseFloat(e) })}
                            selectedValue={updatedAppointment.duration.toString()}
                        >
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
                        value={updatedAppointment.description}
                        onChangeText={(e) => {
                            setUpdatedAppointment({ ...updatedAppointment, description: e });
                        }}
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

export default AppointmentEditForm;
