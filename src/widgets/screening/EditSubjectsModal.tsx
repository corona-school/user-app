import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { Subject } from '@/gql/graphql';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { SubjectSelector } from '../SubjectSelector';

interface EditSubjectsModalProps extends BaseModalProps {
    pupilOrStudentId: number;
    subjects: Subject[];
    onSubjectsUpdated: () => Promise<void>;
    type: 'pupil' | 'student';
}

const UPDATE_PUPIL_SUBJECTS_MUTATION = gql(`
    mutation PupilUpdateSubjects($pupilId: Float!, $data: PupilUpdateSubjectsInput!) { pupilUpdateSubjects(pupilId: $pupilId, data: $data) }
    `);

const UPDATE_STUDENT_SUBJECTS_MUTATION = gql(`
    mutation StudentUpdateSubjects($studentId: Float!, $subjects: [SubjectInput!]) { studentUpdate(studentId: $studentId, data: { subjects: $subjects }) }
    `);

export const EditSubjectsModal = ({ subjects, pupilOrStudentId, type, onSubjectsUpdated, onOpenChange, isOpen }: EditSubjectsModalProps) => {
    const [editedSubjects, setEditedSubjects] = useState<Subject[]>(subjects);
    const [mutationUpdatePupilSubjects, { loading: isLoadingPupil }] = useMutation(UPDATE_PUPIL_SUBJECTS_MUTATION);
    const [mutationUpdateStudentSubjects, { loading: isLoadingStudent }] = useMutation(UPDATE_STUDENT_SUBJECTS_MUTATION);
    const { t } = useTranslation();

    const onSave = async () => {
        try {
            if (type === 'pupil') {
                await mutationUpdatePupilSubjects({
                    variables: {
                        pupilId: pupilOrStudentId,
                        data: {
                            subjects: editedSubjects.map((it) => ({ name: it.name, mandatory: it.mandatory })),
                        },
                    },
                });
            } else {
                await mutationUpdateStudentSubjects({
                    variables: {
                        studentId: pupilOrStudentId,
                        subjects: editedSubjects.map((it) => ({ name: it.name })),
                    },
                });
            }
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.error(t('error'));
        } finally {
            onOpenChange(false);
        }
        onSubjectsUpdated();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Fächer bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4 max-w-[1000px]">
                <SubjectSelector
                    subjects={editedSubjects.map((it) => it.name)}
                    includeDaz
                    addSubject={(it) => {
                        setEditedSubjects((prev) => [...prev, { name: it, mandatory: false }]);
                    }}
                    removeSubject={(it) => {
                        setEditedSubjects((prev) => prev.filter((s) => s.name !== it));
                    }}
                />

                {type === 'pupil' && (
                    <>
                        <Typography className="font-bold">Priorisiertes Fach:</Typography>
                        <SubjectSelector
                            selectable={editedSubjects.map((it) => it.name)}
                            subjects={editedSubjects.filter((it) => it.mandatory).map((it) => it.name)}
                            limit={1}
                            addSubject={(it) => setEditedSubjects((prev) => prev.map(({ name }) => ({ name, mandatory: name === it })))}
                            removeSubject={() => setEditedSubjects((prev) => prev.map(({ name }) => ({ name, mandatory: false })))}
                            justifyContent="left"
                        />
                    </>
                )}
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" isLoading={isLoadingPupil || isLoadingStudent} onClick={onSave}>
                    {t('select')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
