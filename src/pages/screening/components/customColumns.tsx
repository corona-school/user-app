import { Button } from '@/components/Button';
import { IconCheck } from '@tabler/icons-react';
import { HTMLProps, useContext, useEffect, useRef, useState } from 'react';
import { SelectInput } from '@/components/Select';
import { CooperationStudentsContext } from '../context/CooperationStudentsContext';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import { toast } from 'sonner';
import { Checkbox } from '@/components/Checkbox';
import { cn } from '@/lib/Tailwind';

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

const UPDATE_FURTHER_TRAINING_COUNT_MUTATION = gql(`
    mutation UpdateFurtherTrainingCount($studentId: Float!, $furtherTrainingsAttendedCount: Float) {
        studentUpdate(studentId: $studentId, data: { furtherTrainingsAttendedCount: $furtherTrainingsAttendedCount })
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
                className="w-[150px]"
                value={value}
                onValueChange={setValue}
                options={cooperations.map((c) => ({ value: c.id.toString(), label: c.name }))}
            />
            <Button
                isLoading={isUpdatingCooperation}
                disabled={initialValue?.toString() === value || !value}
                variant="accent-dark"
                onClick={handleOnUpdateCooperation}
                className="h-10 w-5"
            >
                <IconCheck size={16} />
            </Button>
        </div>
    );
};

interface FurtherTrainingDropdownProps {
    initialValue?: number;
    studentId: number;
}

export const FurtherTrainingDropdown = ({ initialValue, studentId }: FurtherTrainingDropdownProps) => {
    const [value, setValue] = useState(initialValue?.toString() ?? '');
    const { refresh } = useContext(CooperationStudentsContext);
    const [updateFurtherTrainingCount, { loading: isUpdatingFurtherTrainingCount }] = useMutation(UPDATE_FURTHER_TRAINING_COUNT_MUTATION);
    const handleOnUpdateFurtherTrainingCount = async () => {
        await updateFurtherTrainingCount({
            variables: {
                studentId,
                furtherTrainingsAttendedCount: value ? parseInt(value) : null,
            },
        });
        toast.success('Fortbildungen aktualisiert');
        if (refresh) refresh();
    };

    useEffect(() => {
        setValue(initialValue?.toString() ?? '');
    }, [initialValue]);

    return (
        <div className="flex gap-x-1">
            <SelectInput
                className="min-w-16"
                value={value}
                onValueChange={setValue}
                options={Array.from({ length: 21 }, (_, i) => i).map((i) => ({ label: i.toString(), value: i.toString() }))}
            />
            <Button
                isLoading={isUpdatingFurtherTrainingCount}
                disabled={initialValue?.toString() === value || !value}
                variant="accent-dark"
                onClick={handleOnUpdateFurtherTrainingCount}
                className="h-10 w-5"
            >
                <IconCheck size={16} />
            </Button>
        </div>
    );
};

export const ParallelMatchesCheckbox = ({ initialValue, studentId }: { initialValue?: boolean; studentId: number }) => {
    const [canHaveParallelMatches, setCanHaveParallelMatches] = useState(initialValue);
    const { refresh } = useContext(CooperationStudentsContext);
    const [updateStudentMaxParallelMatches] = useMutation(
        gql(`
            mutation UpdateStudentMaxParallelMatches($studentId: Float!, $maxParallelMatches: Float) {
                studentUpdate(studentId: $studentId, data: { maxParallelMatches: $maxParallelMatches })
            }
        `)
    );

    const handleOnUpdateMaxParallelMatches = async () => {
        console.log('Updating maxParallelMatches for studentId:', studentId, 'to', canHaveParallelMatches ? null : 1);
        await updateStudentMaxParallelMatches({
            variables: {
                studentId,
                maxParallelMatches: canHaveParallelMatches ? null : 1,
            },
        });
        toast.success('Zweitmatches aktualisiert');
        if (refresh) refresh();
    };

    const handleOnCheckedChange = async (checked: boolean) => {
        setCanHaveParallelMatches(checked);
    };

    useEffect(() => {
        setCanHaveParallelMatches(initialValue ?? false);
    }, [initialValue]);

    useEffect(() => {
        if (canHaveParallelMatches !== initialValue) {
            handleOnUpdateMaxParallelMatches();
        }
    }, [canHaveParallelMatches]);

    return (
        <div className="flex gap-x-1 justify-center">
            <IndeterminateCheckbox checked={canHaveParallelMatches} onChange={(e) => handleOnCheckedChange((e.target as HTMLInputElement).checked)} />
        </div>
    );
};

export const IndeterminateCheckbox = ({ indeterminate, className = '', ...rest }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
    const ref = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return <input type="checkbox" ref={ref} className={cn('cursor-pointer accent-primary', className)} {...rest} />;
};
