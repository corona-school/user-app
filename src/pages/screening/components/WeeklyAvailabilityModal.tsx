import { WeeklyAvailabilitySelector } from '@/components/availability/WeeklyAvailabilitySelector';
import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { WeeklyAvailability } from '@/gql/graphql';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EditWeeklyAvailabilityModalProps extends BaseModalProps {
    weeklyAvailability?: WeeklyAvailability;
    onSave: (weeklyAvailability: WeeklyAvailability) => void;
}

export function EditWeeklyAvailabilityModal({ weeklyAvailability: defaultAvailability, onOpenChange, isOpen, onSave }: EditWeeklyAvailabilityModalProps) {
    const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailability | undefined>(defaultAvailability);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        if (!weeklyAvailability) return;
        onSave(weeklyAvailability);
        onOpenChange(false);
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Zeitliche Verfügbarkeit</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col items-center justify-center py-6 px-8">
                <WeeklyAvailabilitySelector onChange={setWeeklyAvailability} availability={weeklyAvailability} />
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" onClick={handleOnSave}>
                    {t('select')}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
