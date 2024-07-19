import { useQuery } from "@apollo/client";
import CenterLoadingSpinner from "../../components/CenterLoadingSpinner";
import WithNavigation from "../../components/WithNavigation";
import { gql } from "../../gql";
import { Button, Column, FormControl, HStack, Heading, Input, Modal, Pressable, Row, Text, VStack } from "native-base";
import HSection from "../../widgets/HSection";
import Card from "../../components/Card";
import { Course_Subject_Enum, Match, Subject } from "../../gql/graphql";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubjectList from "../../widgets/SubjectList";
import { SubjectSelector } from "../../widgets/SubjectSelector";
import useApollo from "../../hooks/useApollo";

function LearningTopicCard({ subject, title, onPress, assignments }: { title: string, subject?: Course_Subject_Enum, onPress: () => void, assignments?: { open: number, finished: number } }) {
    const { t } = useTranslation();

    return (
        <Pressable onPress={onPress}>
            <VStack width="288px" height="288px" padding="24px" backgroundColor="primary.900" borderRadius="8px" justifyContent="space-between">
                <VStack>
                    <Text fontSize={12} color="white" noOfLines={1}>
                        {subject && t(`lernfair.subjects.${subject}` as unknown as TemplateStringsArray)}
                    </Text>
                    <Heading color="white" noOfLines={1}>
                        {title}
                    </Heading>
                    {assignments && <VStack paddingTop="20px">
                        <Text color="white">
                            {assignments.open} offene Aufgaben
                        </Text>
                        <Text color="white">{assignments.finished} erledigte Aufgaben</Text>
                    </VStack>}
                </VStack>
            </VStack>
        </Pressable>
    )
}

type MatchInfo = { id: number, subjectsFormatted: { name?: string | null }[], student: { firstname?: string | null }};
function CreateTopicModal({ onClose, match }: { onClose: () => void, match: MatchInfo }) {
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
        <Modal.Content height={"500px"} maxHeight="unset" width={"500px"} maxWidth="unset" padding={6} marginY={0} borderRadius={"5px"}>
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

export function LearningPupilPage() {
    const { loading, data, refetch } = useQuery(gql(`
        query Learning { 
            me { 
                pupil { 
                    matches { 
                        student { firstname }
                        subjectsFormatted { name }
                        id

                        topics {
                            id
                            name
                            subject
                            openAssignmentsCount
                            finishedAssignmentsCount
                        }
                    }
                }
             }
        }
    `));

    const [createTopicFor, setCreateTopicFor] = useState<MatchInfo>();
    const navigate = useNavigate();

    return <WithNavigation>
        <Column padding={'10px'}>
        {loading && <CenterLoadingSpinner />}
        {!loading && data?.me.pupil?.matches.map(match => <>
            <HSection title={`Lerne mit ${match.student.firstname}`}>
                {match.topics.map(topic => <LearningTopicCard onPress={() => navigate(`/learning/topic/${topic.id}`)} title={topic.name} subject={topic.subject} assignments={{ finished: topic.finishedAssignmentsCount, open: topic.openAssignmentsCount }}/>)}
            </HSection>
            <HStack>
                <Button variant="outline" onPress={() => setCreateTopicFor(match)}>Neues Thema</Button> 
            </HStack>
        </>)}
        
        </Column>

        {createTopicFor && <CreateTopicModal match={createTopicFor} onClose={() => { setCreateTopicFor(undefined); refetch(); }} />}
    </WithNavigation>
}