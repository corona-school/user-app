import { ColumnDef } from '@tanstack/react-table';
import { Student } from '@/gql/graphql';
import { formatDate } from '@/Utility';
import { DateTime } from 'luxon';
import { CooperationStudentsDropdown } from './CooperationStudentsDropdown';
import { CooperationStudentActions } from './CooperationStudentActions';
import { Button } from '@/components/Button';
import { IconArrowDown, IconArrowsUpDown, IconArrowUp } from '@tabler/icons-react';
import { Badge } from '@/components/Badge';

export type CooperationStudent = Pick<Student, 'id' | 'createdAt' | 'email' | 'firstname' | 'lastname' | 'cooperationID'> & {
    hasTutorScreening: boolean;
    hasInstructorScreening: boolean;
};

export const cooperationStudentsColumns: ColumnDef<CooperationStudent>[] = [
    {
        accessorKey: 'email',
        header: 'E-Mail',
    },
    {
        accessorFn: (row) => `${row.firstname} ${row.lastname}`,
        header: 'Name',
    },
    {
        accessorKey: 'createdAt',
        cell: ({ row }) => {
            const createdAt = row.original.createdAt;
            return <span>{createdAt ? formatDate(createdAt, DateTime.DATE_MED) : 'offen'}</span>;
        },
        header: ({ column }) => {
            return (
                <Button variant="none" size="auto" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Registrierungsdatum
                    {column.getIsSorted() === 'asc' && <IconArrowDown className="size-4" />}
                    {column.getIsSorted() === 'desc' && <IconArrowUp className="size-4" />}
                    {!column.getIsSorted() && <IconArrowsUpDown className="size-4 invisible" />}
                </Button>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: 'cooperation',
        header: 'Kooperation',
        cell: ({ row, table }) => {
            return <CooperationStudentsDropdown initialValue={row.original.cooperationID ?? undefined} studentId={row.original.id} />;
        },
    },
    {
        accessorFn: (row) => (row.hasInstructorScreening || row.hasTutorScreening ? 'Angenommen' : 'offen'),
        header: 'Status',
        cell: ({ row, table }) => {
            const status = row.original.hasInstructorScreening || row.original.hasTutorScreening ? 'Angenommen' : 'offen';
            return <Badge variant={status === 'Angenommen' ? 'success' : 'unclear'}>{status}</Badge>;
        },
    },
    {
        id: 'actions',
        header: 'Aktionen',
        cell: ({ row }) => {
            const student = row.original;
            return <CooperationStudentActions student={student} />;
        },
    },
];
