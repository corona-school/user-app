import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { Subject } from '@/gql/graphql';
import { MIN_MAX_GRADE_RANGE } from '@/Utility';
import { SubjectGradeCard } from '../SubjectGradeCard';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubjectOption, SubjectsSelector } from '../SubjectSelector';
import { SingleSubject, SUBJECTS } from '@/types/subject';
import { Separator } from '@/components/Separator';

interface EditSubjectsModalProps extends BaseModalProps {
    subjects: Subject[];
    onSave: (subjects: Subject[]) => void;
    type: 'pupil' | 'student';
}

export const EditSubjectsModal = ({ subjects, onOpenChange, isOpen, type, onSave }: EditSubjectsModalProps) => {
    const [editedSubjects, setEditedSubjects] = useState<Subject[]>(subjects);
    const { t } = useTranslation();

    const subjectOptions: SubjectOption[] = SUBJECTS.map((subject) => ({ subject }));
    const selectedSubjectNames = editedSubjects.map((it) => it.name as SingleSubject);
    const prioritizedSubject = editedSubjects.find((it) => it.mandatory)?.name as SingleSubject;

    const handleOnSubjectsChange = (names: SingleSubject[]) => {
        setEditedSubjects((prev) => names.map((name) => prev.find((it) => it.name === name) ?? { name, mandatory: false, grade: MIN_MAX_GRADE_RANGE }));
    };

    const handleOnPrioritizedChange = (name: SingleSubject) => {
        setEditedSubjects((prev) => prev.map((it) => ({ ...it, mandatory: it.name === name })));
    };

    const isCopyDisabled =
        editedSubjects.length <= 1 ||
        editedSubjects.every((it) => it.grade?.min === editedSubjects[0].grade?.min && it.grade?.max === editedSubjects[0].grade?.max);

    const handleOnSave = async () => {
        if (type === 'pupil') {
            onSave(editedSubjects.map((it) => ({ name: it.name, mandatory: it.mandatory })));
        } else {
            onSave(editedSubjects.map((it) => ({ name: it.name, grade: it.grade })));
        }
        onOpenChange(false);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="md:max-w-[1300px]" size="md">
            <ModalHeader>
                <ModalTitle>Fächer bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4 overflow-y-auto max-h-[550px] p-2">
                <SubjectsSelector
                    multiple
                    value={selectedSubjectNames}
                    onChange={handleOnSubjectsChange}
                    options={subjectOptions}
                    initialVisibleOptions={subjectOptions.length}
                />
                <Separator />
                {type === 'student' && (
                    <div className="flex flex-wrap gap-4">
                        {editedSubjects.map((subject) => (
                            <SubjectGradeCard
                                key={subject.name}
                                subject={subject.name as SingleSubject}
                                range={{ min: subject.grade?.min ?? MIN_MAX_GRADE_RANGE.min, max: subject.grade?.max ?? MIN_MAX_GRADE_RANGE.max }}
                                onRangeChange={(grade) => setEditedSubjects((prev) => prev.map((it) => (it.name === subject.name ? { ...it, grade } : it)))}
                                onCopyToAll={(grade) => setEditedSubjects((prev) => prev.map((it) => ({ ...it, grade })))}
                                isCopyDisabled={isCopyDisabled}
                            />
                        ))}
                    </div>
                )}

                {type === 'pupil' && (
                    <>
                        <Typography className="font-bold">Priorisiertes Fach:</Typography>
                        <SubjectsSelector
                            value={prioritizedSubject}
                            onChange={handleOnPrioritizedChange}
                            options={selectedSubjectNames.map((subject) => ({ subject }))}
                            initialVisibleOptions={selectedSubjectNames.length}
                        />
                    </>
                )}
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
};
