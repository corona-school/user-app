import WithNavigation from '@/components/WithNavigation';
import { cooperationStudentsColumns } from './components/CooperationStudentsTable';
import { DataTable } from '@/components/DataTable';
import { CooperationStudentsContext } from './context/CooperationStudentsContext';
import { Input } from '@/components/Input';
import { useMemo, useState } from 'react';
import { Label } from '@/components/Label';
import { useCooperations } from './useCooperations';

const CooperationStudents = () => {
    const { pendingCooperationStudents, cooperations, refetchPendingCooperationStudents } = useCooperations();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        if (!pendingCooperationStudents) return [];
        return pendingCooperationStudents.filter((student) => {
            const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
            return student.email.toLowerCase().includes(searchTerm.toLowerCase()) || fullName.includes(searchTerm.toLowerCase());
        });
    }, [pendingCooperationStudents, searchTerm]);
    return (
        <CooperationStudentsContext.Provider
            value={{
                cooperations: cooperations ?? [],
                refresh: refetchPendingCooperationStudents,
            }}
        >
            <WithNavigation>
                <div className="px-2 mx-auto w-full max-w-6xl">
                    <div className="flex flex-col gap-y-[6px] w-full">
                        <Label htmlFor="search">Suche</Label>
                        <Input id="search" placeholder="E-Mail oder Name" className="mb-1 w-[400px]" value={searchTerm} onChangeText={setSearchTerm} />
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
