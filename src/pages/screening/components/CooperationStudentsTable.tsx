import { ColumnDef } from '@tanstack/react-table';
import { Student } from '@/gql/graphql';
import { DateTime } from 'luxon';
import { CooperationStudentsDropdown } from './CooperationStudentsDropdown';
import { CooperationStudentActions } from './CooperationStudentActions';
import { Button } from '@/components/Button';
import { IconArrowDown, IconArrowsUpDown, IconArrowUp, IconFlagFilled, IconLink, IconLinkOff } from '@tabler/icons-react';
import { Badge } from '@/components/Badge';
import { ScreeningNotesButton } from './ScreeningNotesButton';

export type CooperationStudent = Pick<
    Student,
    | 'id'
    | 'createdAt'
    | 'email'
    | 'firstname'
    | 'lastname'
    | 'cooperationID'
    | 'descriptionForScreening'
    | 'screeningTags'
    | 'matchesAppointmentStats'
    | 'groupAppointmentStats'
> & {
    hasTutorScreening: boolean;
    hasInstructorScreening: boolean;
    screenedAt: string | null;
    certificateOfConductDeactivationDate: string | null;
    certificateOfConductDateOfInspection: string | null;
    matches: {
        id: number;
        dissolved: boolean;
    }[];
};

export const cooperationStudentsColumns: ColumnDef<CooperationStudent>[] = [
    {
        accessorKey: 'email',
        header: 'E-Mail',
    },
    {
        accessorKey: 'screeningTags',
        cell: ({ row }) => {
            const screeningTags = row.original.screeningTags;
            return <span>{screeningTags.includes('RED_FLAG') && <IconFlagFilled className="text-red-700" />}</span>;
        },
        header: '',
    },
    {
        accessorFn: (row) => `${row.firstname} ${row.lastname}`,
        header: 'Name',
    },
    {
        accessorKey: 'screenedAt',
        cell: ({ row }) => {
            const screenedAt = row.original.screenedAt;
            return <span>{screenedAt ? DateTime.fromISO(screenedAt).toFormat('yyyy.MM.dd') : ''}</span>;
        },
        header: ({ column }) => {
            return (
                <Button variant="none" size="auto" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Gescreent
                    {column.getIsSorted() === 'asc' && <IconArrowDown className="size-4" />}
                    {column.getIsSorted() === 'desc' && <IconArrowUp className="size-4" />}
                    {!column.getIsSorted() && <IconArrowsUpDown className="size-4 invisible" />}
                </Button>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: 'certificateOfConductDateOfInspection',
        cell: ({ row }) => {
            const cocDateOfInspection = row.original.certificateOfConductDateOfInspection;
            return <span>{cocDateOfInspection ? DateTime.fromISO(cocDateOfInspection).toFormat('yyyy.MM.dd') : ''}</span>;
        },
        header: 'FZ',
    },
    {
        accessorKey: 'matchesAppointmentStats',
        cell: ({ row }) => {
            const matchAppointmentsStats = row.original.matchesAppointmentStats;
            return (
                <span>{matchAppointmentsStats ? `${matchAppointmentsStats.successfulAppointments}/${matchAppointmentsStats.plannedAppointments}` : ''}</span>
            );
        },
        header: '1:1',
    },
    {
        accessorKey: 'groupAppointmentStats',
        cell: ({ row }) => {
            const groupAppointmentsStats = row.original.groupAppointmentStats;
            return (
                <span>{groupAppointmentsStats ? `${groupAppointmentsStats.successfulAppointments}/${groupAppointmentsStats.plannedAppointments}` : ''}</span>
            );
        },
        header: 'Kurse',
    },
    {
        accessorKey: 'matches',
        cell: ({ row }) => {
            const matches = row.original.matches;
            const dissolvedMatches = matches.filter((e) => e?.dissolved).length;
            const activeMatches = matches.filter((e) => !e?.dissolved).length;
            return (
                <div className="flex gap-x-2 items-center">
                    <div className="flex items-center">
                        <IconLinkOff size={14} className="text-red-700" />
                        {dissolvedMatches}
                    </div>
                    <div className="flex items-center ">
                        <IconLink size={14} className="text-green-600" />
                        {activeMatches}
                    </div>
                </div>
            );
        },
        header: 'Matches',
    },
    {
        accessorKey: 'cooperation',
        header: 'Kooperation',
        cell: ({ row, table }) => {
            return <CooperationStudentsDropdown initialValue={row.original.cooperationID ?? undefined} studentId={row.original.id} />;
        },
    },
    {
        accessorKey: 'descriptionForScreening',
        header: 'Notiz',
        cell: ({ row, table }) => {
            return (
                <div>
                    <ScreeningNotesButton studentId={row.original.id} notes={row.original.descriptionForScreening} />
                </div>
            );
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
