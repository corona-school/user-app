import { gql } from "@apollo/client";
import { VStack, Heading, FormControl, TextArea, Modal, Button } from "native-base";
import { useState } from "react";
import { Learning_Topic } from "../../gql/graphql";
import useApollo from "../../hooks/useApollo";

type TopicInfo = Pick<Learning_Topic, 'id' | 'name' | 'subject'>;

export function CreateAssignmentModal({ onClose, topic }: { onClose: () => void, topic: TopicInfo }) {
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
