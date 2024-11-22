import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { Subject } from '@/gql/graphql';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubjectSelector } from '../SubjectSelector';

interface EditSubjectsModalProps extends BaseModalProps {
    subjects: Subject[];
    onSave: (subjects: Subject[]) => void;
    type: 'pupil' | 'student';
}

export const EditSubjectsModal = ({ subjects, onOpenChange, isOpen, type, onSave }: EditSubjectsModalProps) => {
    const [editedSubjects, setEditedSubjects] = useState<Subject[]>(subjects);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        if (type === 'pupil') {
            onSave(editedSubjects.map((it) => ({ name: it.name, mandatory: it.mandatory })));
        } else {
            onSave(editedSubjects.map((it) => ({ name: it.name })));
        }
        onOpenChange(false);
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
                <Button className="w-full lg:w-fit" onClick={handleOnSave}>
                    {t('select')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
