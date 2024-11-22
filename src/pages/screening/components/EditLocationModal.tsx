import { Button } from '@/components/Button';
import { LocationSelector } from '@/components/LocationSelector';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { gql } from '@/gql';
import { Pupil_State_Enum, Student_State_Enum } from '@/gql/graphql';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface EditLocationModalProps extends BaseModalProps {
    pupilOrStudentId: number;
    state: Pupil_State_Enum | Student_State_Enum;
    onGradeUpdated: () => Promise<void>;
    type: 'pupil' | 'student';
}

const UPDATE_PUPIL_STATE_MUTATION = gql(`
    mutation PupilUpdateState($pupilId: Float!, $state: State!) { pupilUpdate(pupilId: $pupilId, data: { state: $state }) }
`);

const UPDATE_STUDENT_STATE_MUTATION = gql(`
    mutation StudentUpdateState($studentId: Float!, $state: StudentState!) { studentUpdate(studentId: $studentId, data: { state: $state }) }
`);

export function EditLocationModal({ state, onOpenChange, isOpen, pupilOrStudentId, type, onGradeUpdated }: EditLocationModalProps) {
    const [selectedValue, setSelectedValue] = useState(state);
    const [mutationUpdatePupilState, { loading: isUpdatingPupil }] = useMutation(UPDATE_PUPIL_STATE_MUTATION);
    const [mutationUpdateStudentState, { loading: isUpdatingStudent }] = useMutation(UPDATE_STUDENT_STATE_MUTATION);
    const { t } = useTranslation();

    const onSave = async () => {
        try {
            if (type === 'pupil') {
                await mutationUpdatePupilState({
                    variables: {
                        pupilId: pupilOrStudentId,
                        state: selectedValue as any,
                    },
                });
            } else {
                await mutationUpdateStudentState({
                    variables: {
                        studentId: pupilOrStudentId,
                        state: selectedValue as any,
                    },
                });
            }
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
                <ModalTitle>Ort bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <LocationSelector className="grid grid-cols-4" value={selectedValue as any} setValue={setSelectedValue as any} />
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" isLoading={isUpdatingPupil || isUpdatingStudent} onClick={onSave}>
                    {t('select')}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
