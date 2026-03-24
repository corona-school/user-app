import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
import { Student, StudentScreeningStatus, StudentScreeningType } from '@/gql/graphql';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useScreeningMutations } from '../useScreeningMutations';

interface StudentScreeningModalProps extends BaseModalProps {
    student?: Pick<Student, 'id' | 'email' | 'firstname' | 'lastname'>;
    onScreeningCreated?: () => void;
}

export const StudentScreeningModal = ({ onOpenChange, isOpen, student, onScreeningCreated }: StudentScreeningModalProps) => {
    const { t } = useTranslation();
    const [approvedForOneToOne, setApprovedForOneToOne] = useState(false);
    const [approvedForGroups, setApprovedForGroups] = useState(false);
    const { mutationCreateStudentScreening, creatingStudentScreening } = useScreeningMutations();

    const handleOnCreateScreenings = async () => {
        if (!student) return;
        if (approvedForOneToOne) {
            await mutationCreateStudentScreening({
                variables: {
                    studentId: student.id,
                    type: StudentScreeningType.Tutor,
                    screening: {
                        status: StudentScreeningStatus.Success,
                    },
                },
                refetchQueries: approvedForGroups ? [] : ['GetPendingCooperationStudents', 'GetPendingCooperationStudentsCount'],
            });
        }
        if (approvedForGroups) {
            await mutationCreateStudentScreening({
                variables: {
                    studentId: student.id,
                    type: StudentScreeningType.Instructor,
                    screening: {
                        status: StudentScreeningStatus.Success,
                    },
                },
                refetchQueries: ['GetPendingCooperationStudents', 'GetPendingCooperationStudentsCount'],
            });
        }

        toast.success('Screening(s) erfolgreich erstellt');
        onOpenChange(false);
        if (onScreeningCreated) onScreeningCreated();
    };

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="w-full max-w-fit">
            <ModalHeader>
                <ModalTitle>Screening</ModalTitle>
            </ModalHeader>
            <div>
                <div className="flex gap-6 w-full">
                    <Toggle
                        variant="outline"
                        size="lg"
                        className="p-8 h-auto min-w-72"
                        pressed={approvedForOneToOne}
                        onPressedChange={() => setApprovedForOneToOne(!approvedForOneToOne)}
                        asChild
                        role="button"
                    >
                        <div className="flex gap-x-4">
                            <Checkbox checked={approvedForOneToOne} onCheckedChange={() => setApprovedForOneToOne(!approvedForOneToOne)}></Checkbox>
                            Für 1:1 freischalten
                        </div>
                    </Toggle>
                    <Toggle
                        variant="outline"
                        size="lg"
                        className="p-8 h-auto min-w-72"
                        pressed={approvedForGroups}
                        onPressedChange={() => setApprovedForGroups(!approvedForGroups)}
                        asChild
                        role="button"
                    >
                        <div className="flex gap-x-4">
                            <Checkbox checked={approvedForGroups} onCheckedChange={() => setApprovedForGroups(!approvedForGroups)}></Checkbox>
                            Für Gruppen freischalten
                        </div>
                    </Toggle>
                </div>
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button
                    className="w-full lg:w-fit"
                    onClick={handleOnCreateScreenings}
                    disabled={!approvedForOneToOne && !approvedForGroups}
                    isLoading={creatingStudentScreening}
                >
                    Freischalten
                </Button>
            </ModalFooter>
        </Modal>
    );
};
