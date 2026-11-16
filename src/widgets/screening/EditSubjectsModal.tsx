import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Slider } from '@/components/Slider';
import { Typography } from '@/components/Typography';
import { Subject } from '@/gql/graphql';
import { getGradeLabel, MIN_MAX_GRADE_RANGE } from '@/Utility';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubjectOption, SubjectsSelector } from '../SubjectSelector';
import { SingleSubject, SUBJECTS } from '@/types/subject';

interface EditSubjectsModalProps extends BaseModalProps {
    subjects: Subject[];
    onSave: (subjects: Subject[]) => void;
    type: 'pupil' | 'student';
}

interface SubjectGradeSliderProps {
    subject: Subject;
    setSubject: (subject: Subject) => void;
}

const SubjectGradeSlider = ({ subject, setSubject }: SubjectGradeSliderProps) => {
    const onValueChange = (range: [number, number]) => {
        setSubject({ name: subject.name, grade: { min: range[0], max: range[1] } });
    };

    const { min, max } = MIN_MAX_GRADE_RANGE;
    const currentMin = subject?.grade?.min ?? min;
    const currentMax = subject?.grade?.max ?? max;

    return (
        <div className="bg-primary-lighter p-4 rounded-md">
            <div>
                <Typography className="font-bold">{subject.name}</Typography>
                <Typography className="mb-4">
                    {getGradeLabel(currentMin)} {currentMin !== currentMax ? `- ${getGradeLabel(currentMax)}` : ''}
                </Typography>
            </div>
            <Slider min={min} step={1} max={max} value={[currentMin, currentMax]} onValueChange={onValueChange} />
        </div>
    );
};

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
                {type === 'student' && (
                    <div className="flex flex-col gap-y-4">
                        {editedSubjects.map((e) => (
                            <SubjectGradeSlider
                                key={e.name}
                                subject={e}
                                setSubject={(updatedSubject) => {
                                    setEditedSubjects((prev) => prev.map((e) => (e.name === updatedSubject.name ? updatedSubject : e)));
                                }}
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
