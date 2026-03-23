import WithNavigation from '@/components/WithNavigation';
import { cooperationStudentsColumns } from './components/CooperationStudentsTable';
import { DataTable } from '@/components/DataTable';
import { CooperationStudentsContext } from './context/CooperationStudentsContext';
import { Input } from '@/components/Input';
import { useMemo, useState } from 'react';
import { Label } from '@/components/Label';
import { useCooperations } from './useCooperations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';

const CooperationStudents = () => {
    const { cooperationStudents, cooperations, refetchCooperationStudents } = useCooperations();
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('all');

    const filteredStudents = useMemo(() => {
        if (!cooperationStudents) return [];
        return cooperationStudents.filter((student) => {
            const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
            const matchesSearchTerm = student.email.toLowerCase().includes(searchTerm.toLowerCase()) || fullName.includes(searchTerm.toLowerCase());
            const studentStatus = student.hasInstructorScreening || student.hasTutorScreening ? 'angenommen' : 'ausstehend';
            const matchesStatus = status === 'all' || studentStatus === status;
            return matchesSearchTerm && matchesStatus;
        });
    }, [cooperationStudents, searchTerm, status]);
    return (
        <CooperationStudentsContext.Provider
            value={{
                cooperations: cooperations ?? [],
                refresh: refetchCooperationStudents,
            }}
        >
            <WithNavigation>
                <div className="px-2 mx-auto w-full max-w-6xl">
                    <div className="flex gap-x-5 items-center justify-normal mb-5">
                        <div className="flex flex-col gap-y-[6px]">
                            <Label htmlFor="search">Suche</Label>
                            <Input
                                id="search"
                                placeholder="E-Mail oder Name"
                                errorMessageClassName="hidden"
                                className="mb-1 w-[400px]"
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                            />
                        </div>
                        <div className="flex flex-col gap-y-[6px]">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus} defaultValue="all">
                                <SelectTrigger className="w-[400px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alle</SelectItem>
                                    <SelectItem value="angenommen">Angenommen</SelectItem>
                                    <SelectItem value="ausstehend">Ausstehend</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DataTable
                        columns={cooperationStudentsColumns}
                        data={
                            filteredStudents.map((student) => ({
                                ...student,
                                cooperation: cooperations.find((c) => c.id === student.cooperationID)?.name ?? '',
                            })) ?? []
                        }
                        initialSorting={[{ id: 'createdAt', desc: false }]}
                    />
                </div>
            </WithNavigation>
        </CooperationStudentsContext.Provider>
    );
};

export default CooperationStudents;
