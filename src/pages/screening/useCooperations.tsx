import { gql } from '@/gql';
import { useQuery } from '@apollo/client';

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

const GET_PENDING_COOPERATION_STUDENTS_COUNT_QUERY = gql(`
    query GetPendingCooperationStudentsCount {
        cooperationStudentsToBeConfirmedCount
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

export const useCooperations = () => {
    const { data: pendingCooperationStudentsData, refetch: refetchPending } = useQuery(GET_PENDING_COOPERATION_STUDENTS_QUERY);
    const { data: pendingCooperationStudentsCountData } = useQuery(GET_PENDING_COOPERATION_STUDENTS_COUNT_QUERY);
    const { data: cooperationListData } = useQuery(GET_COOPERATION_LIST);

    return {
        pendingCooperationStudents: pendingCooperationStudentsData?.cooperationStudentsToBeConfirmed ?? [],
        pendingCooperationStudentsCount: pendingCooperationStudentsCountData?.cooperationStudentsToBeConfirmedCount ?? 0,
        cooperations: cooperationListData?.cooperations ?? [],
        refetchPendingCooperationStudents: refetchPending,
    };
};
