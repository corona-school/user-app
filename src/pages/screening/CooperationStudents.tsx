import WithNavigation from '@/components/WithNavigation';
import { gql } from '@/gql';
import { useQuery } from '@apollo/client';
import { cooperationStudentsColumns } from './components/CooperationStudentsTable';
import { DataTable } from '@/components/DataTable';
import { CooperationStudentsContext } from './context/CooperationStudentsContext';
import { Input } from '@/components/Input';
import { useMemo, useState } from 'react';
import { Label } from '@/components/Label';

const GET_PENDING_COOPERATION_STUDENTS_QUERY = gql(`
    query GetPendingCooperationStudents {
        cooperationStudentsToBeConfirmed {
            id
            email
            firstname
            lastname
            cooperationID
            createdAt
        }
    }    
`);

const GET_COOPERATION_LIST = gql(`
    query GetCooperations {
        cooperations {
            id
            name
            type
        }
    }    
`);

const CooperationStudents = () => {
    const { data: pendingCooperationStudentsData, refetch: refetchPending } = useQuery(GET_PENDING_COOPERATION_STUDENTS_QUERY);
    const { data: cooperationListData } = useQuery(GET_COOPERATION_LIST);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        if (!pendingCooperationStudentsData?.cooperationStudentsToBeConfirmed) return [];
        return pendingCooperationStudentsData.cooperationStudentsToBeConfirmed.filter((student) => {
            const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
            return student.email.toLowerCase().includes(searchTerm.toLowerCase()) || fullName.includes(searchTerm.toLowerCase());
        });
    }, [pendingCooperationStudentsData, searchTerm]);
    return (
        <CooperationStudentsContext.Provider
            value={{
                cooperations: cooperationListData?.cooperations ?? [],
                refresh: refetchPending,
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
                                cooperation: cooperationListData?.cooperations.find((c) => c.id === student.cooperationID)?.name ?? '',
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
