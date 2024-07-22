import { useParams } from "react-router-dom";
import WithNavigation from "../../components/WithNavigation";
import { useQuery } from "@apollo/client";
import CenterLoadingSpinner from "../../components/CenterLoadingSpinner";
import { Button, HStack } from "native-base";
import HSection from "../../widgets/HSection";
import { gql } from "../../gql";
import { useState } from "react";
import { LearningAssignmentCard } from "../../widgets/learning/LearningAssignmentCard";
import { CreateAssignmentModal } from "../../modals/learning/CreateAssignmentModal";


export function LearningTopicPupilPage() {
    const { id: _topicID } = useParams();
    const topicID = parseInt(_topicID!, 10);

    const [newAssignmentOpen, setNewAssignmentOpen] = useState(false);

    const { loading, data, refetch } = useQuery(gql(`
        query GetTopic($id: Int!) {
            learningTopic(id: $id) {
                id
                name
                subject

                assignments {
                    id
                    task
                    status
                }
            }
        }
    `), { variables: { id: topicID }});

    return <WithNavigation showBack>
        {loading && <CenterLoadingSpinner />}
        {!loading && <>
            <HSection title={`${data?.learningTopic.subject} / ${data?.learningTopic.name}`}>
                {data?.learningTopic.assignments.map(assignment => 
                    <LearningAssignmentCard assignment={assignment} />)}
            </HSection>
            <HStack>
                <Button variant="outline" onPress={() => setNewAssignmentOpen(true)}>Neue Aufgabe</Button> 
            </HStack>
        </>}
        {newAssignmentOpen && <CreateAssignmentModal onClose={() => { setNewAssignmentOpen(false); refetch(); }} topic={data?.learningTopic!} />}
    </WithNavigation>
}