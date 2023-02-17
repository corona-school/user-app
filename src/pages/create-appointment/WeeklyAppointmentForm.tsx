import { Divider, FormControl, HStack, IconButton, TextArea, useBreakpointValue, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import AppointmentDate from '../../widgets/appointment/AppointmentDate';
import InputSuffix from '../../widgets/InputSuffix';
import RemoveIcon from '../../assets/icons/lernfair/remove_circle_outline.svg';
import { useWeeklyAppointments } from '../../context/AppointmentContext';
import { WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';

type WeeklyProps = {
    index: number;
    isLast: boolean;
    nextDate: string;
};

const WeeklyAppointmentForm: React.FC<WeeklyProps> = ({ index, isLast }) => {
    const { t } = useTranslation();
    const { weeklies, dispatchWeeklyAppointment } = useWeeklyAppointments();

    const handleInput = (e: any) => {
        dispatchWeeklyAppointment({
            type: WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_TITLE,
            value: e.target.value,
            index,
            field: 'title',
        });
    };

    const width = useBreakpointValue({
        base: isLast ? '70%' : '90%',
        lg: isLast ? '40%' : '46%',
    });

    return (
        <HStack space={3}>
            <AppointmentDate current={false} date={weeklies[index].nextDate} />
            <VStack space={3} width={width}>
                <FormControl>
                    <InputSuffix appointmentsCount={weeklies[index].index} handleInput={handleInput} inputValue={weeklies[index].title} />
                    <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>{t('appointment.create.emptyFieldError')}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl>
                    <TextArea
                        placeholder={t('appointment.create.descriptionLabel')}
                        _light={{ placeholderTextColor: 'primary.500' }}
                        autoCompleteType={'normal'}
                        value={weeklies?.[index]?.['description'] ?? ''}
                        onChangeText={(e) =>
                            dispatchWeeklyAppointment({
                                type: WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_DESCRIPTION,
                                value: e,
                                index,
                                field: 'description',
                            })
                        }
                    />
                </FormControl>
            </VStack>

            {isLast && (
                <HStack space={3} alignItems={'flex-start'}>
                    <Divider orientation="vertical" />
                    <IconButton
                        icon={<RemoveIcon />}
                        onPress={() => {
                            console.log('Dispatch remove');
                            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.REMOVE_WEEKLY_APPOINTMENT });
                        }}
                    />
                </HStack>
            )}
        </HStack>
    );
};

export default WeeklyAppointmentForm;
