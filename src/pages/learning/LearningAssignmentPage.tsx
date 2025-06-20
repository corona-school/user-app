import { useNavigate, useParams } from 'react-router-dom';
import WithNavigation from '../../components/WithNavigation';
import { useQuery } from '@apollo/client';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { Heading } from 'native-base';
import { gql } from '../../gql';
import { LearningNoteList } from '../../widgets/learning/LearningNoteList';

export function LearningAssignmentPupilPage() {
    const { id: _assignmentID } = useParams();
    const assignmentID = parseInt(_assignmentID!, 10);

    const navigate = useNavigate();

    const { loading, data, refetch } = useQuery(
        gql(`
        query GetAssignment($id: Int!) {
            learningAssignment(id: $id) {
                task
                
                notes {
                    id
                    type
                    authorName
                    text
                }
            }
        }
    `),
        { variables: { id: assignmentID }, pollInterval: 1000 }
    );

    return (
        <WithNavigation showBack>
            {loading && <CenterLoadingSpinner />}
            {!loading && (
                <>
                    <Heading>{data?.learningAssignment.task}</Heading>
                    {data && <LearningNoteList refetch={refetch} assignmentId={assignmentID} notes={data.learningAssignment.notes} />}
                </>
            )}
        </WithNavigation>
    );
}
