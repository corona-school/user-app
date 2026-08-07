import WithNavigation from '@/components/WithNavigation';
import { cooperationStudentsColumns } from './components/CooperationStudentsTable';
import { DataTable } from '@/components/DataTable';
import { CooperationStudentsContext } from './context/CooperationStudentsContext';
import { Input } from '@/components/Input';
import { useMemo, useState } from 'react';
import { Label } from '@/components/Label';
import { useCooperations } from './useCooperations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Checkbox } from '@/components/Checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getCoreRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { IconCopy } from '@tabler/icons-react';

const CooperationStudents = () => {
    const { cooperationStudents, cooperations, refetchCooperationStudents } = useCooperations();
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([{ id: 'screenedAt', desc: false }]);
    const [filters, setFilters] = useLocalStorage({
        key: 'cooperation-students-filters',
        initialValue: {
            searchTerm: '',
            status: 'offen',
            cooperation: 'all',
            bookmarked: false,
            idNotControlled: false,
            cocNotSubmitted: false,
        },
    });

    const filteredStudents = useMemo(() => {
        if (!cooperationStudents) return [];
        return cooperationStudents.filter((student) => {
            const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
            const matchesSearchTerm =
                student.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) || fullName.includes(filters.searchTerm.toLowerCase());
            const studentStatus = student.hasInstructorScreening || student.hasTutorScreening ? 'angenommen' : 'offen';
            const matchesStatus = filters.status === 'all' || studentStatus === filters.status;
            const matchesCooperation = filters.cooperation === 'all' || student.cooperationID?.toString() === filters.cooperation;
            const matchesBookmarked = !filters.bookmarked || (filters.bookmarked && student.screeningTags.includes('BOOKMARKED'));
            const matchesIdNotControlled = !filters.idNotControlled || (filters.idNotControlled && !student.screeningTags.includes('ID_CONTROLLED'));
            const matchesCocNotSubmitted = !filters.cocNotSubmitted || (filters.cocNotSubmitted && !student.certificateOfConduct?.dateOfInspection);
            return matchesSearchTerm && matchesStatus && matchesCooperation && matchesBookmarked && matchesIdNotControlled && matchesCocNotSubmitted;
        });
    }, [cooperationStudents, filters]);

    const handleOnCopyEmails = async () => {
        const selectedEmails = Object.keys(rowSelection)
            .map((rowId) => cooperationStudents.find((student) => student.id.toString() === rowId)?.email)
            .filter((email) => email !== undefined)
            .join(', ');
        await navigator.clipboard.writeText(selectedEmails);
        toast.success('E-Mail-Adressen kopiert', { duration: 1000 });
    };

    return (
        <CooperationStudentsContext.Provider
            value={{
                cooperations: cooperations ?? [],
                refresh: refetchCooperationStudents,
            }}
        >
            <WithNavigation>
                <div className="h-[calc(100vh-100px)] flex flex-col px-2">
                    <div className="flex gap-x-5 items-center mb-5 shrink-0">
                        <div className="flex flex-col gap-y-[6px]">
                            <Label htmlFor="search">Suche</Label>
                            <Input
                                id="search"
                                placeholder="E-Mail oder Name"
                                errorMessageClassName="hidden"
                                className="mb-1 w-[400px]"
                                value={filters.searchTerm}
                                onChangeText={(value) => setFilters({ ...filters, searchTerm: value })}
                            />
                        </div>
                        <div className="flex flex-col gap-y-[6px]">
                            <Label htmlFor="status">Status</Label>
                            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })} defaultValue="offen">
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alle</SelectItem>
                                    <SelectItem value="angenommen">Angenommen</SelectItem>
                                    <SelectItem value="offen">Offen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-y-[6px]">
                            <Label htmlFor="cooperation">Kooperation</Label>
                            <Select value={filters.cooperation} onValueChange={(value) => setFilters({ ...filters, cooperation: value })} defaultValue="all">
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Kooperationen" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alle</SelectItem>
                                    {cooperations.map((cooperation) => (
                                        <SelectItem key={cooperation.id} value={cooperation.id.toString()}>
                                            {cooperation.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-x-4 mb-5">
                        <div className="flex items-center justify-center gap-x-2">
                            <Checkbox
                                id="red-flagged"
                                checked={filters.bookmarked}
                                onCheckedChange={(value) => setFilters({ ...filters, bookmarked: !!value })}
                            />
                            <Label htmlFor="red-flagged">Markiert</Label>
                        </div>
                        <div className="flex items-center justify-center gap-x-2">
                            <Checkbox
                                id="id-not-controlled"
                                checked={filters.idNotControlled}
                                onCheckedChange={(value) => setFilters({ ...filters, idNotControlled: !!value })}
                            />
                            <Label htmlFor="id-not-controlled">Ausweis nicht kontrolliert</Label>
                        </div>
                        <div className="flex items-center justify-center gap-x-2">
                            <Checkbox
                                id="coc-not-submitted"
                                checked={filters.cocNotSubmitted}
                                onCheckedChange={(value) => setFilters({ ...filters, cocNotSubmitted: !!value })}
                            />
                            <Label htmlFor="coc-not-submitted">FZ nicht eingereicht</Label>
                        </div>
                    </div>
                    <DataTable
                        getTableRowClass={(row) => (row.screeningTags.includes('BOOKMARKED') ? 'bg-red-50 hover:bg-red-100' : '')}
                        config={{
                            data: filteredStudents.map((student) => ({
                                ...student,
                                cooperation: cooperations.find((c) => c.id === student.cooperationID)?.name ?? '',
                                certificateOfConductDateOfInspection: student.certificateOfConduct?.dateOfInspection ?? null,
                                certificateOfConductDeactivationDate: student.certificateOfConductDeactivationDate ?? null,
                            })),
                            columns: cooperationStudentsColumns as any,
                            getCoreRowModel: getCoreRowModel(),
                            onSortingChange: setSorting,
                            getSortedRowModel: getSortedRowModel(),
                            getRowId: (row) => row.id.toString(),
                            state: {
                                sorting,
                                rowSelection,
                            },
                            enableRowSelection: true,
                            onRowSelectionChange: setRowSelection,
                        }}
                    />
                    <div className="mt-2">
                        <Button
                            leftIcon={<IconCopy size={14} />}
                            variant="optional"
                            size="sm"
                            onClick={handleOnCopyEmails}
                            disabled={Object.keys(rowSelection).length === 0}
                        >
                            {Object.keys(rowSelection).length} E-Mail-Adressen als Text kopieren
                        </Button>
                    </div>
                </div>
            </WithNavigation>
        </CooperationStudentsContext.Provider>
    );
};

export default CooperationStudents;
