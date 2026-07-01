import { gql } from '@/gql';
import { useMutation } from '@apollo/client';

const CREATE_STUDENT_SCREENING_MUTATION = gql(`
    mutation ScreenStudent($studentId: Float!, $type: StudentScreeningType!, $screening: Instructor_screeningCreateInput!) {
        studentScreeningCreate(studentId: $studentId, type: $type, screening: $screening)
    }
`);

const UPDATE_STUDENT_SCREENING_MUTATION = gql(`
    mutation UpdateStudentScreening($screeningId: Float!, $type: StudentScreeningType!, $screening: ScreeningUpdateInput!) {
        studentScreeningUpdate(screeningId: $screeningId, type: $type, data: $screening)
    }
`);

const DELETE_STUDENT_SCREENING_MUTATION = gql(`
    mutation DeleteStudentScreening($screeningId: Float!, $type: StudentScreeningType!) {
        studentScreeningDelete(screeningId: $screeningId, type: $type)
    }
`);

export const useScreeningMutations = () => {
    const [mutationCreateStudentScreening, { loading: creatingStudentScreening }] = useMutation(CREATE_STUDENT_SCREENING_MUTATION);
    const [mutationUpdateStudentScreening, { loading: loadingUpdateStudentScreening }] = useMutation(UPDATE_STUDENT_SCREENING_MUTATION);
    const [mutationDeleteStudentScreening, { loading: deletingStudentScreening }] = useMutation(DELETE_STUDENT_SCREENING_MUTATION);

    return {
        mutationCreateStudentScreening,
        creatingStudentScreening,
        mutationUpdateStudentScreening,
        loadingUpdateStudentScreening,
        mutationDeleteStudentScreening,
        deletingStudentScreening,
    };
};
