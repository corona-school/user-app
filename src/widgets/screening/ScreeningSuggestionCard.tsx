import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Button } from '@/components/Button';
import { toast } from 'sonner';

const MUTATION_SEND_SUGGESTION = gql(`
    mutation SendSuggestion($userID: String!, $suggestion: Int!) {
        screenerSuggest(userID: $userID, suggestionNotificationId: $suggestion)
    }
`);

const QUERY_GET_SUGGESTIONS = gql(`
    query GetPossibleSuggestions {
        notifications(where: { onActions: { has: "screening_suggestion" }, active: { equals: true } }, take: 100) {
            id
            description
        }
    }
`);

export function ScreeningSuggestionCard({ userID }: { userID: string }) {
    const [chosenSuggestion, setChosenSuggestion] = useState<number>(0);
    const [send, { loading, reset }] = useMutation(MUTATION_SEND_SUGGESTION);
    const { data: suggestionsData } = useQuery(QUERY_GET_SUGGESTIONS);
    const suggestions = suggestionsData?.notifications;

    if (!suggestions || suggestions.length === 0) return null;

    const handleOnSend = async () => {
        await send({ variables: { userID, suggestion: chosenSuggestion } });
        toast.success('Empfehlung verschickt');
        reset();
        setChosenSuggestion(0);
    };

    return (
        <div className="flex gap-x-5">
            <Select value={'' + chosenSuggestion} onValueChange={(it) => setChosenSuggestion(+it)}>
                <SelectTrigger className="h-10 min-w-[500px]" placeholder="Auswählen">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={'' + 0}>Keine Empfehlung</SelectItem>
                    {suggestions.map((option) => (
                        <SelectItem key={option.id} value={'' + option.id}>
                            {option.description}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button isLoading={loading} disabled={!chosenSuggestion} reasonDisabled="Du musst eine Empfehlung auswählen" onClick={handleOnSend}>
                Empfehlung senden
            </Button>
        </div>
    );
}
