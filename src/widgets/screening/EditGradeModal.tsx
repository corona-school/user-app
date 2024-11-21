import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { GradeSelector } from '../../components/GradeSelector';

interface EditGradeModalProps extends BaseModalProps {
    pupilId: number;
    grade: number;
    onGradeUpdated: () => Promise<void>;
}

const UPDATE_GRADE_MUTATION = gql(`
    mutation PupilUpdateGrade($pupilId: Float!, $gradeAsInt: Int!) { pupilUpdate(pupilId: $pupilId, data: { gradeAsInt: $gradeAsInt }) }
`);

export function EditGradeModal({ grade, onOpenChange, isOpen, pupilId, onGradeUpdated }: EditGradeModalProps) {
    const [selectedGrade, setSelectedGrade] = useState(grade);
    const [mutationUpdateGrade, { loading: isLoading }] = useMutation(UPDATE_GRADE_MUTATION);
    const { t } = useTranslation();

    const onSave = async () => {
        try {
            await mutationUpdateGrade({
                variables: {
                    pupilId,
                    gradeAsInt: selectedGrade,
                },
            });
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.error(t('error'));
        } finally {
            onOpenChange(false);
        }
        onGradeUpdated();
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Klasse bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <div className="grid grid-cols-5">
                    <GradeSelector grade={selectedGrade} onGradeChange={setSelectedGrade} />
                </div>
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" isLoading={isLoading} onClick={onSave}>
                    {t('select')}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
