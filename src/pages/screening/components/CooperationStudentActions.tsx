import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/Dropdown';
import { Button } from '@/components/Button';
import { IconDotsVertical } from '@tabler/icons-react';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { StudentScreeningModal } from './StudentScreeningModal';
import { useContext, useState } from 'react';
import { CooperationStudentsContext } from '../context/CooperationStudentsContext';
import { Typography } from '@/components/Typography';
import { Student } from '@/gql/graphql';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

interface CooperationStudentActionsProps {
    student: Pick<Student, 'id' | 'createdAt' | 'email' | 'firstname' | 'lastname' | 'cooperationID'> & {
        hasTutorScreening: boolean;
        hasInstructorScreening: boolean;
    };
}

const REMOVE_IS_FROM_COOPERATION_MUTATION = gql(`
    mutation RemoveStudentFromCooperation($studentId: Float!) {
        studentUpdate(studentId: $studentId, data: { registrationSource: normal })
    }
`);

export const CooperationStudentActions = ({ student }: CooperationStudentActionsProps) => {
    const { refresh } = useContext(CooperationStudentsContext);
    const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
    const [showConfirmRemoveFromList, setShowConfirmRemoveFromList] = useState(false);
    const searchParams = new URLSearchParams({ search: student.email });
    const [removeStudentFromCooperation] = useMutation(REMOVE_IS_FROM_COOPERATION_MUTATION, {
        variables: {
            studentId: student.id,
        },
        refetchQueries: ['GetPendingCooperationStudents', 'GetPendingCooperationStudentsCount'],
    });

    const onRemoveFromList = async () => {
        await removeStudentFromCooperation();
        toast.success('HuH aus der Liste entfernt');
        setShowConfirmRemoveFromList(false);
        if (refresh) refresh();
    };
    return (
        <div>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => window.open(`/start?${searchParams.toString()}`, '_blank')}>Profil anzeigen</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setIsScreeningModalOpen(true);
                        }}
                        disabled={student.hasInstructorScreening || student.hasTutorScreening}
                    >
                        Freischalten
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:bg-destructive-lighter focus:text-destructive"
                        onClick={() => setShowConfirmRemoveFromList(true)}
                        disabled={student.hasInstructorScreening || student.hasTutorScreening}
                    >
                        Aus der Liste entfernen
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmationModal
                isOpen={showConfirmRemoveFromList}
                variant="destructive"
                onOpenChange={setShowConfirmRemoveFromList}
                headline="Aus der Liste entfernen"
                description={
                    <Typography>
                        Willst du{' '}
                        <b>
                            {student?.firstname} {student?.lastname}
                        </b>{' '}
                        wirklich aus der Liste entfernen? Er/Sie wird dann weder für 1:1 noch für Gruppenkurse freigeschaltet und muss einen Screening-Termin
                        buchen.
                    </Typography>
                }
                confirmButtonText="Aus der Liste entfernen"
                onConfirm={() => {
                    setShowConfirmRemoveFromList(false);
                    onRemoveFromList();
                }}
            />
            <StudentScreeningModal student={student} isOpen={isScreeningModalOpen} onOpenChange={setIsScreeningModalOpen} onScreeningCreated={refresh} />
        </div>
    );
};
