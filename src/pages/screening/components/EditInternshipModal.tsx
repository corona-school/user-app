import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import type { CooperationStudent } from './CooperationStudentsTable';
import { Label } from '@/components/Label';
import { SelectInput } from '@/components/Select';
import { Internship_Status_Enum } from '@/gql/graphql';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

interface EditInternshipModalProps extends BaseModalProps {
    student?: CooperationStudent;
    onSaved?: () => void;
}

const UPDATE_INTERNSHIP_MUTATION = gql(`
    mutation UpdateStudentInternshipMutation($internshipId: Float!, $data: InternshipCreateInput!) {
        studentUpdateInternship(internshipId: $internshipId, data: $data)
    }
`);

const CREATE_INTERNSHIP_MUTATION = gql(`
    mutation CreateStudentInternshipMutation($studentId: Float!, $data: InternshipCreateInput!) {
        studentCreateInternship(studentId: $studentId, data: $data)
    }
`);

export const EditInternshipModal = ({ onOpenChange, isOpen, student, onSaved }: EditInternshipModalProps) => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState<Date | undefined>(
        student?.internship?.startDate ? DateTime.fromISO(student.internship.startDate).toJSDate() : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        student?.internship?.endDate ? DateTime.fromISO(student.internship.endDate).toJSDate() : undefined
    );
    const [status, setStatus] = useState<string>(student?.internship?.status ?? '');
    const [updateInternship] = useMutation(UPDATE_INTERNSHIP_MUTATION);
    const [createInternship] = useMutation(CREATE_INTERNSHIP_MUTATION);

    // check only when the exact internship fields change
    useEffect(() => {
        setStartDate(student?.internship?.startDate ? DateTime.fromISO(student.internship.startDate).toJSDate() : undefined);
        setEndDate(student?.internship?.endDate ? DateTime.fromISO(student.internship.endDate).toJSDate() : undefined);
        setStatus(student?.internship?.status ?? '');
    }, [student?.internship?.startDate, student?.internship?.endDate, student?.internship?.status]);

    const handleOnSave = async () => {
        if (student?.internship?.id) {
            await updateInternship({
                variables: {
                    internshipId: student.internship.id,
                    data: {
                        startDate: startDate?.toISOString(),
                        endDate: endDate?.toISOString(),
                        status: status as Internship_Status_Enum,
                    },
                },
            });
        } else {
            await createInternship({
                variables: {
                    studentId: student!.id,
                    data: {
                        startDate: startDate?.toISOString(),
                        endDate: endDate?.toISOString(),
                        status: status as Internship_Status_Enum,
                    },
                },
            });
        }
        onSaved?.();
        toast.success('Praktikum gespeichert');
        onOpenChange?.(false);
    };

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="w-full max-w-fit" size="lg">
            <ModalHeader>
                <ModalTitle>Praktikum</ModalTitle>
            </ModalHeader>

            <div className="flex flex-col gap-y-4">
                <div className="flex gap-6 w-full">
                    <div className="flex flex-col flex-1 gap-y-1">
                        <Label htmlFor="start-date">Start Datum</Label>
                        <DatePicker
                            id="start-date"
                            value={startDate}
                            onChange={setStartDate}
                            disabled={false}
                            startMonth={DateTime.now().startOf('year').toJSDate()}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-y-1">
                        <Label htmlFor="end-date">End Datum</Label>
                        <DatePicker id="end-date" value={endDate} onChange={setEndDate} disabled={false} />
                    </div>
                    <div className="flex flex-col flex-1 gap-y-1">
                        <Label htmlFor="status">Status</Label>
                        <SelectInput
                            className="w-full"
                            value={status}
                            onValueChange={setStatus}
                            options={[
                                {
                                    value: Internship_Status_Enum.InProgress,
                                    label: 'Laufend',
                                },
                                {
                                    value: Internship_Status_Enum.Completed,
                                    label: 'Abgeschlossen',
                                },
                                {
                                    value: Internship_Status_Enum.Cancelled,
                                    label: 'Abgebrochen',
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" onClick={handleOnSave}>
                    Speichern
                </Button>
            </ModalFooter>
        </Modal>
    );
};
