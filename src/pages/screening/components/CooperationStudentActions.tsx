import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/Dropdown';
import { Button } from '@/components/Button';
import { IconCheck, IconDotsVertical } from '@tabler/icons-react';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { StudentScreeningModal } from './StudentScreeningModal';
import { useContext, useState } from 'react';
import { CooperationStudentsContext } from '../context/CooperationStudentsContext';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import type { CooperationStudent } from './CooperationStudentsTable';

interface CooperationStudentActionsProps {
    student: CooperationStudent;
}

const REMOVE_IS_FROM_COOPERATION_MUTATION = gql(`
    mutation RemoveStudentFromCooperation($studentId: Float!) {
        studentUpdate(studentId: $studentId, data: { registrationSource: normal })
    }
`);

const CREATE_STUDENT_FLAG = gql(`
    mutation CreateCooperationStudentFlags($userId: String!, $flag: String!) {
        adminUserFlagCreate(data:  {
           userId: $userId,
           flag: $flag
        }) { id }
    }
`);

const DELETE_STUDENT_FLAG = gql(`
    mutation DeleteCooperationStudentFlags($id: Float!) {
        adminUserFlagDelete(id: $id)
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
    const [createCooperationStudentFlag] = useMutation(CREATE_STUDENT_FLAG, {});
    const [deleteCooperationStudentFlag] = useMutation(DELETE_STUDENT_FLAG, {});

    const onRemoveFromList = async () => {
        await removeStudentFromCooperation();
        toast.success('HuH aus der Liste entfernt');
        setShowConfirmRemoveFromList(false);
        if (refresh) refresh();
    };

    const onIdentificationControlledToggle = async () => {
        const identificationControlledFlag = student.adminUserFlags.find((flag) => flag.flag === 'ID_CONTROLLED');
        if (identificationControlledFlag?.id) {
            await deleteCooperationStudentFlag({
                variables: {
                    id: identificationControlledFlag.id,
                },
            });
        } else {
            await createCooperationStudentFlag({
                variables: {
                    userId: `student/${student.id}`,
                    flag: 'ID_CONTROLLED',
                },
            });
        }

        toast.success(`Ausweis ${identificationControlledFlag ? 'nicht mehr' : ''} kontrolliert`);
        if (refresh) refresh();
    };

    const onBookmarkToggle = async () => {
        const bookmarkFlag = student.adminUserFlags.find((flag) => flag.flag === 'BOOKMARKED');
        if (bookmarkFlag?.id) {
            await deleteCooperationStudentFlag({
                variables: {
                    id: bookmarkFlag.id,
                },
            });
        } else {
            await createCooperationStudentFlag({
                variables: {
                    userId: `student/${student.id}`,
                    flag: 'BOOKMARKED',
                },
            });
        }
        toast.success(`Änderungen gespeichert: ${bookmarkFlag ? 'nicht mehr' : ''} markiert`);
        if (refresh) refresh();
    };

    const userFlags = student.adminUserFlags.map((flag) => flag.flag);

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
                    <DropdownMenuItem onClick={onIdentificationControlledToggle}>
                        Ausweis kontrolliert {userFlags.includes('ID_CONTROLLED') ? <IconCheck /> : null}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onBookmarkToggle}>Markieren {userFlags.includes('BOOKMARKED') ? <IconCheck /> : null}</DropdownMenuItem>
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
