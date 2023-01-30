import { Box, FormControl, Stack, TextArea, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import InputSuffix from '../../widgets/InputSuffix';

const AddAppointmentWeekly: React.FC = () => {
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
                    <FormControl.Label>Beschreibung (optional)</FormControl.Label>
                    <TextArea placeholder="Das ist eine Beschreibung" autoCompleteType={'normal'} />
                </FormControl>
            </Stack>
        </Box>
    );
};

export default AddAppointmentWeekly;
