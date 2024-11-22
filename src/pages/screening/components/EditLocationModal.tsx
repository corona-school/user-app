import { Button } from '@/components/Button';
import { LocationSelector } from '@/components/LocationSelector';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Pupil_State_Enum, Student_State_Enum } from '@/gql/graphql';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type State = Pupil_State_Enum | Student_State_Enum;

interface EditLocationModalProps<T> extends BaseModalProps {
    state: T;
    onSave: (state: T) => void;
}

export function EditLocationModal<T extends State>({ state, onOpenChange, isOpen, onSave }: EditLocationModalProps<T>) {
    const [selectedValue, setSelectedValue] = useState(state);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        onSave(selectedValue);
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Ort bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <LocationSelector className="grid grid-cols-4" value={selectedValue as any} setValue={setSelectedValue as any} />
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
