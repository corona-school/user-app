import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GradeSelector } from '../../components/GradeSelector';

interface EditGradeModalProps extends BaseModalProps {
    grade: number;
    onSave: (grade: number) => void;
}

export function EditGradeModal({ grade, onOpenChange, isOpen, onSave }: EditGradeModalProps) {
    const [selectedGrade, setSelectedGrade] = useState(grade);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        onSave(selectedGrade);
        onOpenChange(false);
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Klasse bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <GradeSelector className="grid grid-cols-5" grade={selectedGrade} onGradeChange={setSelectedGrade} />
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
