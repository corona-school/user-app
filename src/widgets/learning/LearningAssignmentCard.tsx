import { VStack, CheckIcon, QuestionIcon, Heading, Pressable, Circle } from 'native-base';
import { Learning_Assignment } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';

export type AssignmentInfo = Pick<Learning_Assignment, 'id' | 'task' | 'status'>;

export function LearningAssignmentCard({ assignment }: { assignment: AssignmentInfo }) {
    const navigate = useNavigate();

    return (
        <Pressable onPress={() => navigate(`/learning/assignment/${assignment.id}`)}>
            <VStack width="288px" height="288px" padding="24px" backgroundColor="primary.900" borderRadius="8px" justifyContent="space-between">
                <Circle size={'lg'} background="lightText">
                    {assignment.status === 'done' ? <CheckIcon color="primary.900" size="64px" /> : <QuestionIcon color="primary.900" size="64px" />}
                </Circle>
                <Heading color="white">{assignment.task}</Heading>
            </VStack>
        </Pressable>
    );
}
