import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { SchoolTypeSelector } from '@/components/SchoolTypeSelector';
import { Pupil_Schooltype_Enum } from '@/gql/graphql';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EditSchoolTypeModalProps extends BaseModalProps {
    onSave: (value: Pupil_Schooltype_Enum) => void;
    schoolType: Pupil_Schooltype_Enum;
}

export function EditSchoolTypeModal({ schoolType, onOpenChange, onSave, isOpen }: EditSchoolTypeModalProps) {
    const [selectedValue, setSelectedValue] = useState(schoolType);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        onSave(selectedValue);
        onOpenChange(false);
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Schulform bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <SchoolTypeSelector className="grid grid-cols-4" value={selectedValue as any} setValue={setSelectedValue as any} />
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
