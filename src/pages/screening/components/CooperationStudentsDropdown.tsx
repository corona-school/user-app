import { Button } from '@/components/Button';
import { IconCheck } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import { SelectInput } from '@/components/Select';
import { CooperationStudentsContext } from '../context/CooperationStudentsContext';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import { toast } from 'sonner';

interface CooperationStudentsDropdownProps {
    initialValue?: number;
    onCooperationUpdated?: () => void;
    studentId: number;
}

const UPDATE_COOPERATION_MUTATION = gql(`
    mutation UpdateStudentCooperation($studentId: Float!, $cooperationId: Float) {
        studentUpdate(studentId: $studentId, data: { cooperationId: $cooperationId })
    }
`);

export const CooperationStudentsDropdown = ({ initialValue, studentId }: CooperationStudentsDropdownProps) => {
    const [value, setValue] = useState(initialValue?.toString() ?? '');
    const { cooperations, refresh } = useContext(CooperationStudentsContext);
    const [updateStudentCooperation, { loading: isUpdatingCooperation }] = useMutation(UPDATE_COOPERATION_MUTATION);
    const handleOnUpdateCooperation = async () => {
        await updateStudentCooperation({
            variables: {
                studentId,
                cooperationId: value ? parseInt(value) : null,
            },
        });
        toast.success('Kooperation aktualisiert');
        if (refresh) refresh();
    };

    useEffect(() => {
        setValue(initialValue?.toString() ?? '');
    }, [initialValue]);

    return (
        <div className="flex gap-x-1">
            <SelectInput
                className="w-[200px]"
                value={value}
                onValueChange={setValue}
                options={cooperations.map((c) => ({ value: c.id.toString(), label: c.name }))}
            />
            <Button
                isLoading={isUpdatingCooperation}
                disabled={initialValue?.toString() === value || !value}
                size="icon"
                variant="accent-dark"
                onClick={handleOnUpdateCooperation}
            >
                <IconCheck />
            </Button>
        </div>
    );
};
