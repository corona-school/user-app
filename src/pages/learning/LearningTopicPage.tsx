import { useNavigate, useParams } from "react-router-dom";
import WithNavigation from "../../components/WithNavigation";
import { useQuery } from "@apollo/client";
import CenterLoadingSpinner from "../../components/CenterLoadingSpinner";
import { Button, CheckIcon, Circle, FormControl, HStack, Heading, Input, Modal, QuestionIcon, TextArea, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import HSection from "../../widgets/HSection";
import { gql } from "../../gql";
import { useState } from "react";
import useApollo from "../../hooks/useApollo";
import { Learning_Topic } from "../../gql/graphql";


function LearningAssignmentCard({ task, done, onPress }: { task: string, onPress: () => void, done?: boolean }) {
    return (
        <Pressable onPress={onPress}>
            <VStack width="288px" height="288px" padding="24px" backgroundColor="primary.900" borderRadius="8px" justifyContent="space-between">
                    <Circle size={'lg'} background="lightText">
                        {done ? <CheckIcon color="primary.900" size="64px" /> : <QuestionIcon color="primary.900" size="64px" />}
                    </Circle><Heading color="white">
                        {task}
                    </Heading>
            </VStack>
        </Pressable>
    )
}

type TopicInfo = Pick<Learning_Topic, 'id' | 'name' | 'subject'>;

function CreateAssignmentModal({ onClose, topic }: { onClose: () => void, topic: TopicInfo }) {
    const [task, setTask] = useState("");

    const { client } = useApollo();

    async function createAssignment() {
        await client.mutate({
            mutation: gql(`
            mutation CreateAssignment($topicId: Int!, $task: String!) {
                learningAssignmentCreate(topicId: $topicId, task: $task) { id }
            }
            `),
            variables: {
                topicId: topic.id,
                task
            }
         });

        onClose();
    }

    async function proposeAssignment() {
        setTask("...");

        const proposal = await client.mutate({
            mutation: gql(`
            mutation ProposeAssignment($topicId: Int!) {
                learningAssignmentPropose(topicId: $topicId)
            }
            `),
            variables: {
                topicId: topic.id
            }
         });

        setTask(proposal.data!.learningAssignmentPropose);
    }

    return <Modal isOpen onClose={onClose}>
        <Modal.Content maxW={"800px"} padding={6} marginY={0} borderRadius={"5px"} overflowY="auto">
                <Modal.CloseButton />
                <VStack height="100%" space={6}>
                    <Heading>Neue Aufgabe für {topic.subject} / {topic.name}</Heading>
                    <FormControl>
                        <TextArea minHeight="400px" autoCompleteType="" value={task} onChangeText={setTask} />

                        <VStack>
                            <Button variant="outline" onPress={proposeAssignment}>Vorschlag generieren</Button>
                            <Button disabled={!task} onPress={createAssignment}>Aufgabe erstellen</Button>
                        </VStack>
                        
                    </FormControl>
                </VStack>
        </Modal.Content>         
    </Modal>
}

export function LearningTopicPupilPage() {
    const { id: _topicID } = useParams();
    const topicID = parseInt(_topicID!, 10);

    const [newAssignmentOpen, setNewAssignmentOpen] = useState(false);

    const navigate = useNavigate();

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
                    <LearningAssignmentCard done={assignment.status === "done"} task={assignment.task} onPress={() => navigate(`/learning/assignment/${assignment.id}`)} />)}
            </HSection>
            <HStack>
                <Button variant="outline" onPress={() => setNewAssignmentOpen(true)}>Neue Aufgabe</Button> 
            </HStack>
        </>}
        {newAssignmentOpen && <CreateAssignmentModal onClose={() => { setNewAssignmentOpen(false); refetch(); }} topic={data?.learningTopic!} />}
    </WithNavigation>
}