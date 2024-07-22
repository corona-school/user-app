import { useMutation, gql } from "@apollo/client";
import { VStack, TextArea, HStack, Button, Text } from "native-base";
import { useState } from "react";
import { Learning_Note } from "../../gql/graphql";
import useApollo from "../../hooks/useApollo";

type Note = Pick<Learning_Note, 'authorName' | 'type' | 'text'>;

export function LearningNoteList({ notes, assignmentId, refetch }: { notes: Note[], assignmentId: number, refetch: () => void }) {
    const [text, setText] = useState('');
    const { client } = useApollo();

    const [ask, { loading, }] = useMutation(
        gql(`
        mutation Ask($assignmentId: Int!, $text: String!) {
            learningNoteCreate(note: {
                assignmentId: $assignmentId
                type: comment
                text: $text
            }) { id }
        }
    `)
    );

    async function send() {
        await ask({ variables: { text, assignmentId } });

        setText('');
        refetch();
    }

    return <VStack>
        {notes.map(note => <LearningNoteRow note={note} />)}

        <TextArea value={text} onChangeText={setText} autoCompleteType={""} />
        <HStack space={'10px'}>
            <Button disabled={loading} onPress={send}>Senden</Button>
        </HStack>
    </VStack>
}


export function LearningNoteRow({ note }: { note: Note }) {
    const color = {
        answer: 'white',
        correct_answer: '#98FF98',
        wrong_answer: '#FFCCCB',
        question: 'lightblue',
        comment: 'white',
        task: 'lightorange'
    }[note.type];

    return <HStack margin='5px' padding={'10px'} style={{ backgroundColor: color }} borderRadius='5px'>
        <Text paddingRight='5px'>{note.authorName}: </Text>
        <Text>{note.text}</Text>
    </HStack>
}
