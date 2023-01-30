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
                    <FormControl.Label>Titel</FormControl.Label>
                    <InputSuffix />
                    <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>Textfeld darf nicht leer sein</FormControl.ErrorMessage>
                </FormControl>

                <FormControl>
                    <FormControl.Label>Datum</FormControl.Label>
                    <DatePicker />
                </FormControl>

                <FormControl>
                    <FormControl.Label>Uhrzeit</FormControl.Label>
                    <DatePicker type="time" />
                </FormControl>

                <FormControl>
                    <FormControl.Label>Dauer</FormControl.Label>
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
                    <FormControl.Label>Beschreibung (optional)</FormControl.Label>
                    <TextArea placeholder="Das ist eine Beschreibung" autoCompleteType={'normal'} />
                </FormControl>
                <Checkbox _checked={{ backgroundColor: 'danger.900' }} value="weekly" onChange={() => setWeekly(!weekly)}>
                    wöchentlich wiederholen...
                </Checkbox>
            </Stack>
            {weekly && <AddAppointmentWeekly />}
        </Box>
    );
};

export default AddAppointment;
