import { Divider, FormControl, HStack, IconButton, TextArea, useBreakpointValue, VStack, WarningTwoIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import AppointmentDate from '../../widgets/AppointmentDate';
import InputSuffix from '../../widgets/InputSuffix';
import RemoveIcon from '../../assets/icons/lernfair/remove_circle_outline.svg';
import { useWeeklyAppointments } from '../../context/AppointmentContext';
import { WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';
import { useState } from 'react';

type WeeklyProps = {
    index: number;
    isLast: boolean;
    nextDate: string;
};

const WeeklyAppointmentForm: React.FC<WeeklyProps> = ({ index, isLast }) => {
    const { t } = useTranslation();
    const { weeklies, dispatchWeeklyAppointment } = useWeeklyAppointments();

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const handleTitleInput = (e: any) => {
        setTitle(e.target.value);
    };

    const handleDescriptionInput = (e: any) => {
        setDescription(e);
    };

    const width = useBreakpointValue({
        base: isLast ? '70%' : '85%',
        lg: isLast ? '40%' : '46%',
    });

    return (
        <HStack space={3}>
            <AppointmentDate current={false} date={weeklies[index].nextDate} />
            <VStack space={3} width={width}>
                <FormControl>
                    <InputSuffix
                        appointmentsCount={weeklies[index].index}
                        handleInput={handleTitleInput}
                        inputValue={title}
                        handleBlur={() =>
                            dispatchWeeklyAppointment({
                                type: WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_TITLE,
                                value: title,
                                index,
                                field: 'title',
                            })
                        }
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningTwoIcon size="xs" />}>{t('appointment.create.emptyFieldError')}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl>
                    <TextArea
                        placeholder={t('appointment.create.descriptionLabel')}
                        _light={{ placeholderTextColor: 'primary.500' }}
                        autoCompleteType={'normal'}
                        value={description}
                        onChangeText={(e) => handleDescriptionInput(e)}
                        onBlur={() =>
                            dispatchWeeklyAppointment({
                                type: WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_DESCRIPTION,
                                value: description,
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
                            dispatchWeeklyAppointment({ type: WeeklyReducerActionType.REMOVE_WEEKLY_APPOINTMENT });
                        }}
                    />
                </HStack>
            )}
        </HStack>
    );
};

export default WeeklyAppointmentForm;
