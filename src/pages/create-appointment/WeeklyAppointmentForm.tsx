import { useTranslation } from 'react-i18next';
import AppointmentDate from '../../widgets/AppointmentDate';
import { useWeeklyAppointments } from '../../context/AppointmentContext';
import { WeeklyReducerActionType } from '../../types/lernfair/CreateAppointment';
import { useState } from 'react';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { Separator } from '@/components/Separator';
import { Button } from '@/components/Button';
import { IconCircleMinus } from '@tabler/icons-react';

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

    const appointmentsCount = weeklies[index].index;

    return (
        <div className="flex w-full gap-x-4">
            <AppointmentDate current={false} date={weeklies[index].nextDate} />
            <div className="flex flex-col gap-y-4 w-[75%]">
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="title">{t('appointment.create.inputPlaceholder')}</Label>
                    <Input
                        className="w-full"
                        id="title"
                        value={title}
                        placeholder={t('appointment.create.lecture') + `${appointmentsCount ? ' #' : ''}${appointmentsCount ?? ''}`}
                        onChange={handleTitleInput}
                        onBlur={() =>
                            dispatchWeeklyAppointment({
                                type: WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_TITLE,
                                value: title,
                                index,
                                field: 'title',
                            })
                        }
                    />
                </div>
                <div className="flex flex-col gap-y-1 flex-1">
                    <Label htmlFor="description">{t('appointment.create.descriptionLabel')}</Label>
                    <TextArea
                        id="description"
                        value={description}
                        onChange={(e) => handleDescriptionInput(e.target.value)}
                        placeholder={t('appointment.create.descriptionPlaceholder')}
                        onBlur={() =>
                            dispatchWeeklyAppointment({
                                type: WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_DESCRIPTION,
                                value: description,
                                index,
                                field: 'description',
                            })
                        }
                    />
                </div>
            </div>

            {isLast && (
                <div className="flex items-start gap-x-3">
                    <Separator orientation="vertical" />
                    <Button variant="ghost" size="icon" onClick={() => dispatchWeeklyAppointment({ type: WeeklyReducerActionType.REMOVE_WEEKLY_APPOINTMENT })}>
                        <IconCircleMinus />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default WeeklyAppointmentForm;
