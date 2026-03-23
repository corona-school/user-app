import { gql } from '@/gql';
import { useQuery } from '@apollo/client';

const GET_COOPERATION_STUDENTS_QUERY = gql(`
    query GetPendingCooperationStudents {
        cooperationStudentsToBeConfirmed {
            id
            email
            firstname
            lastname
            cooperationID
            createdAt
            tutorScreenings {
                id
            }
            instructorScreenings {
                id
            }
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
    const { data: cooperationStudents, refetch: refetchCooperationStudents } = useQuery(GET_COOPERATION_STUDENTS_QUERY);
    const { data: pendingCooperationStudentsCountData } = useQuery(GET_PENDING_COOPERATION_STUDENTS_COUNT_QUERY);
    const { data: cooperationListData } = useQuery(GET_COOPERATION_LIST);

    return {
        cooperationStudents:
            cooperationStudents?.cooperationStudentsToBeConfirmed.map((e) => ({
                ...e,
                hasInstructorScreening: e.instructorScreenings.some((s) => !!s),
                hasTutorScreening: e.tutorScreenings.some((s) => !!s),
            })) ?? [],
        pendingCooperationStudentsCount: pendingCooperationStudentsCountData?.cooperationStudentsToBeConfirmedCount ?? 0,
        cooperations: cooperationListData?.cooperations ?? [],
        refetchCooperationStudents: refetchCooperationStudents,
    };
};
