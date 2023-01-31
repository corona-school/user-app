import { Box, Checkbox, FormControl, Select, Stack, TextArea, WarningTwoIcon } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import InputSuffix from '../../widgets/InputSuffix';
import AddAppointmentWeekly from './AddAppointmentWeekly';

const AddAppointment: React.FC = () => {
    const [weekly, setWeekly] = useState<boolean>(false);
    const { t } = useTranslation();

    return (
        <Box width="100%">
            <Stack space={3}>
                <FormControl>
                    <FormControl.Label>{t('appointment.createAppointment.titleLabel')}</FormControl.Label>
                    <InputSuffix />
                    <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>
                        {t('appointment.createAppointment.emptyFieldError')}
                    </FormControl.ErrorMessage>
                </FormControl>

                <FormControl>
                    <FormControl.Label>{t('appointment.createAppointment.dateLabel')}</FormControl.Label>
                    <DatePicker />
                </FormControl>

                <FormControl>
                    <FormControl.Label>{t('appointment.createAppointment.timeLabel')}</FormControl.Label>
                    <DatePicker type="time" />
                </FormControl>

                <FormControl>
                    <FormControl.Label>{t('appointment.createAppointment.durationLabel')}</FormControl.Label>
                    <Select>
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

                <FormControl>
                    <FormControl.Label>{t('appointment.createAppointment.descriptionLabel')}</FormControl.Label>
                    <TextArea placeholder={t('appointment.createAppointment.descriptionPlaceholder')} autoCompleteType={'normal'} />
                </FormControl>
                <Checkbox _checked={{ backgroundColor: 'danger.900' }} value="weekly" onChange={() => setWeekly(!weekly)}>
                    {t('appointment.createAppointment.weeklyRepeat')}
                </Checkbox>
            </Stack>
            {weekly && <AddAppointmentWeekly />}
        </Box>
    );
};

export default AddAppointment;
