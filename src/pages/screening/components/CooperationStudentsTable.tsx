import { ColumnDef } from '@tanstack/react-table';
import { Student } from '@/gql/graphql';
import { DateTime } from 'luxon';
import { CooperationStudentsDropdown, FurtherTrainingDropdown, IndeterminateCheckbox, ParallelMatchesCheckbox } from './customColumns';
import { CooperationStudentActions } from './CooperationStudentActions';
import { Button } from '@/components/Button';
import { IconAlertTriangle, IconArrowDown, IconArrowsUpDown, IconArrowUp, IconCheck, IconFlagFilled, IconId, IconLink, IconLinkOff } from '@tabler/icons-react';
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
    | 'maxParallelMatches'
    | 'furtherTrainingsAttendedCount'
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
        id: 'select',
        header: ({ table }) => (
            <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
        cell: ({ row }) => (
            <div className="px-1">
                <IndeterminateCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
            </div>
        ),
    },
    {
        accessorKey: 'email',
        header: 'E-Mail',
        cell: ({ row }) => {
            const email = row.original.email;
            const screeningTags = row.original.screeningTags;
            return (
                <div className="flex gap-x-2 items-center text-sm">
                    <span>{email}</span> {screeningTags.includes('RED_FLAG') && <IconFlagFilled size={16} className="text-red-700" />}
                </div>
            );
        },
    },
    {
        accessorFn: (row) => `${row.firstname} ${row.lastname}`,
        header: 'Name',
        cell: ({ row }) => {
            const name = `${row.original.firstname} ${row.original.lastname}`;
            const screeningTags = row.original.screeningTags;
            return (
                <div className="flex gap-x-2 items-center text-sm">
                    <span>{name}</span> {screeningTags.includes('ID_CONTROLLED') && <IconId size={16} className="text-green-700" />}
                </div>
            );
        },
    },
    {
        accessorKey: 'screenedAt',
        cell: ({ row }) => {
            const screenedAt = row.original.screenedAt;
            return <span className="text-sm">{screenedAt ? DateTime.fromISO(screenedAt).toFormat('yyyy.MM.dd') : ''}</span>;
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
        cell: ({ row }) => {
            const { certificateOfConductDeactivationDate, certificateOfConductDateOfInspection } = row.original;
            if (certificateOfConductDeactivationDate) {
                return (
                    <div className="flex gap-x-1 items-center text-amber-500 text-sm">
                        <IconAlertTriangle size={14} />
                        <div>
                            {certificateOfConductDeactivationDate
                                ? DateTime.fromISO(certificateOfConductDeactivationDate).minus({ days: 1 }).toFormat('yyyy.MM.dd')
                                : ''}
                        </div>
                    </div>
                );
            }
            if (certificateOfConductDateOfInspection) {
                return <IconCheck className="text-green-600" />;
            }

            return null;
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
        cell: ({ row }) => {
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
            return (
                <Badge className="px-1" variant={status === 'Angenommen' ? 'success' : 'unclear'}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorFn: (row) => (row.hasInstructorScreening || row.hasTutorScreening ? 'Angenommen' : 'offen'),
        header: '∞ Matches',
        cell: ({ row, table }) => {
            return <ParallelMatchesCheckbox initialValue={row.original.maxParallelMatches === null} studentId={row.original.id} />;
        },
    },
    {
        accessorFn: (row) => (row.hasInstructorScreening || row.hasTutorScreening ? 'Angenommen' : 'offen'),
        header: 'FoBi',
        cell: ({ row, table }) => {
            return <FurtherTrainingDropdown initialValue={row.original.furtherTrainingsAttendedCount ?? undefined} studentId={row.original.id} />;
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const student = row.original;
            return <CooperationStudentActions student={student} />;
        },
    },
];
