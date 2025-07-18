import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Slider } from '@/components/Slider';
import { Typography } from '@/components/Typography';
import { Subject } from '@/gql/graphql';
import { getGradeLabel, MIN_MAX_GRADE_RANGE } from '@/Utility';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubjectSelector } from '../SubjectSelector';

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

    const handleOnSave = async () => {
        if (type === 'pupil') {
            onSave(editedSubjects.map((it) => ({ name: it.name, mandatory: it.mandatory })));
        } else {
            onSave(editedSubjects.map((it) => ({ name: it.name, grade: it.grade })));
        }
        onOpenChange(false);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Fächer bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4 max-w-[1000px] overflow-y-auto max-h-[550px]">
                <SubjectSelector
                    subjects={editedSubjects.map((it) => it.name)}
                    includeDaz
                    addSubject={(it) => {
                        setEditedSubjects((prev) => [...prev, { name: it, mandatory: false, grade: MIN_MAX_GRADE_RANGE }]);
                    }}
                    removeSubject={(it) => {
                        setEditedSubjects((prev) => prev.filter((s) => s.name !== it));
                    }}
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
                <Button className="w-full lg:w-fit" onClick={handleOnSave}>
                    {t('select')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
