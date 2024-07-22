import { gql } from "@apollo/client";
import { VStack, Heading, FormControl, Input, Modal, Button } from "native-base";
import { useState } from "react";
import { Course_Subject_Enum } from "../../gql/graphql";
import useApollo from "../../hooks/useApollo";
import { SubjectSelector } from "../../widgets/SubjectSelector";

export type MatchInfo = { id: number, subjectsFormatted: { name?: string | null }[], student: { firstname?: string | null }};

export function CreateTopicModal({ onClose, match }: { onClose: () => void, match: MatchInfo }) {
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState<Course_Subject_Enum>();
    const { client } = useApollo();
    async function createTopic() {
        await client.mutate({
            mutation: gql(`
            mutation CreateTopic($matchId: Int!, $name: String!, $subject: String!) {
                learningTopicCreate(matchId: $matchId, name: $name, subject: $subject) { id }
            }
            `),
            variables: {
                matchId: match.id,
                name: topic,
                subject: subject as string
            }
         });

        onClose();
    }
    return <Modal isOpen onClose={onClose}>
        <Modal.Content maxW={"500px"} padding={6} marginY={0} borderRadius={"5px"}>
                <Modal.CloseButton />
                <VStack height="100%" space={6}>
                    <Heading>Neues Thema mit {match.student.firstname}</Heading>
                    <FormControl>
                        <FormControl.Label>Thema</FormControl.Label>
                        <Input value={topic} onChangeText={setTopic} />

                        <FormControl.Label>Fach</FormControl.Label>
                        <SubjectSelector 
                            selectable={match.subjectsFormatted.map(it => it.name!)}
                            variant="selection"
                            removeSubject={() => {}}
                            addSubject={it => setSubject(it as Course_Subject_Enum)}
                            subjects={subject ? [subject] : []}
                        />

                        <Button disabled={!topic || !subject} onPress={createTopic}>Thema erstellen</Button>
                    </FormControl>
                </VStack>
        </Modal.Content>         
    </Modal>
}
