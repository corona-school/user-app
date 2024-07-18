import { useNavigate, useParams } from "react-router-dom";
import WithNavigation from "../../components/WithNavigation";
import { useQuery } from "@apollo/client";
import CenterLoadingSpinner from "../../components/CenterLoadingSpinner";
import { Heading, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import HSection from "../../widgets/HSection";
import { gql } from "../../gql";

function LearningAssignmentCard({ task, onPress }: { task: string, onPress: () => void }) {
    return (
        <Pressable onPress={onPress}>
            <VStack width="288px" height="288px" padding="24px" backgroundColor="primary.900" borderRadius="8px" justifyContent="space-between">
                <VStack>
                    <Heading color="white" noOfLines={1}>
                        {task}
                    </Heading>
                </VStack>
            </VStack>
        </Pressable>
    )
}

export function LearningTopicPupilPage() {
    const { id: _topicID } = useParams();
    const topicID = parseInt(_topicID!, 10);

    const navigate = useNavigate();

    const { loading, data } = useQuery(gql(`
        query GetTopic($id: Int!) {
            learningTopic(id: $id) {
                name
                subject

                assignments {
                    id
                    task
                }
            }
        }
    `), { variables: { id: topicID }});

    return <WithNavigation showBack>
        {loading && <CenterLoadingSpinner />}
        {!loading && <>
            <HSection title={`${data?.learningTopic.name}`}>
                {data?.learningTopic.assignments.map(assignment => 
                    <LearningAssignmentCard task={assignment.task} onPress={() => navigate(`/learning/assignment/${assignment.id}`)} />)}
            </HSection>

            
        </>}
    </WithNavigation>
}