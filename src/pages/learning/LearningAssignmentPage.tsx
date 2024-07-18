import { useNavigate, useParams } from "react-router-dom";
import WithNavigation from "../../components/WithNavigation";
import { useQuery } from "@apollo/client";
import CenterLoadingSpinner from "../../components/CenterLoadingSpinner";
import { Button, HStack, Heading, Text, TextArea, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import HSection from "../../widgets/HSection";
import { gql } from "../../gql";
import { Learning_Note } from "../../gql/graphql";
import useApollo from "../../hooks/useApollo";
import { useState } from "react";

type Note = Pick<Learning_Note, 'authorName' | 'type' | 'text'>;

function NotesUI({ notes, assignmentId, refetch }: { notes: Note[], assignmentId: number, refetch: () => void }) {
    const [text, setText] = useState('');
    const { client } = useApollo();

    async function ask() {
        await client.mutate({
            mutation: gql(`
                mutation Ask($assignmentId: Int!, $text: String!) {
                    learningNoteCreate(note: {
                        assignmentId: $assignmentId
                        type: question
                        text: $text
                    }) { id }
                }
            `),
            variables: { text, assignmentId }
        });

        refetch();
    }

    async function addAnswer() {
        await client.mutate({
            mutation: gql(`
                mutation AddAnswer($assignmentId: Int!, $text: String!) {
                    learningNoteCreate(note: {
                        assignmentId: $assignmentId
                        type: answer
                        text: $text
                    }) { id }
                }
            `),
            variables: { text, assignmentId }
        });

        refetch();
    }

    return <VStack>
        {notes.map(note => <NoteUI note={note} />)}

        <TextArea value={text} onChangeText={setText} autoCompleteType={""} />
        <HStack space={'10px'}>
            <Button onPress={ask}>Frage stellen</Button>
            <Button onPress={addAnswer}>Ich habs!</Button>
        </HStack>
    </VStack>
}


function NoteUI({ note }: { note: Note }) {
    const color = {
        answer: 'lightgreen',
        correct_answer: 'green',
        wrong_answer: 'lightred',
        question: 'lightblue',
        comment: 'white',
        task: 'lightorange'
    }[note.type];

    return <HStack margin='5px' padding={'10px'} style={{ backgroundColor: color }} borderRadius='5px'>
        <Text paddingRight='5px'>{note.authorName}: </Text>
        <Text>{note.text}</Text>
    </HStack>
}

export function LearningAssignmentPupilPage() {
    const { id: _assignmentID } = useParams();
    const assignmentID = parseInt(_assignmentID!, 10);

    const navigate = useNavigate();

    const { loading, data, refetch } = useQuery(gql(`
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
    `), { variables: { id: assignmentID }, pollInterval: 1000 });

    return <WithNavigation showBack>
        {loading && <CenterLoadingSpinner />}
        {!loading && <>
            <Heading>{data?.learningAssignment.task}</Heading>
            {data && <NotesUI refetch={refetch} assignmentId={assignmentID} notes={data.learningAssignment.notes} />}
        </>}
    </WithNavigation>
}