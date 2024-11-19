import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { Button, HStack, Select, VStack, useTheme } from 'native-base';
import { useEffect, useState } from 'react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { InfoCard } from '../../components/InfoCard';
import DisableableButton from '../../components/DisablebleButton';

export function ScreeningSuggestionCard({ userID }: { userID: string }) {
    const { space } = useTheme();

    const { data: suggesionsData } = useQuery(
        gql(`
                query GetPossibleSuggestions {
                    notifications(where: { onActions: { has: "screening_suggestion" }, active: { equals: true } }, take: 100) {
                        id
                        description
                    }
                }
            `)
    );

    const suggestions = suggesionsData?.notifications;

    const [chosenSuggestion, setChosenSuggestion] = useState<number>(0);
    const [send, { loading, data: sendDone, reset }] = useMutation(
        gql(`
                    mutation SendSuggestion($userID: String!, $suggestion: Int!) {
                        screenerSuggest(userID: $userID, suggestionNotificationId: $suggestion)
                    }
                `)
    );

    // After one second, show the suggestions again
    useEffect(() => {
        if (sendDone) {
            const timer = setTimeout(reset, 5000);
            return () => clearTimeout(timer);
        }
    }, [sendDone, reset]);

    if (!suggestions || suggestions.length === 0) return null;
    if (loading) return <CenterLoadingSpinner />;
    if (sendDone) {
        return <InfoCard icon="yes" title="Empfehlung verschickt" message="" />;
    }

    return (
        <HStack paddingTop="20px" space={space['2']} display="flex">
            <Select onValueChange={(it) => setChosenSuggestion(+it)} selectedValue={'' + chosenSuggestion}>
                <Select.Item key="0" value={'' + 0} label="Keine Empfehlung" />
                {suggestions.map((it) => (
                    <Select.Item key={it.id} value={'' + it.id} label={it.description} />
                ))}
            </Select>
            <DisableableButton
                isDisabled={!chosenSuggestion}
                reasonDisabled="Du musst eine Empfehlung auswählen"
                onPress={() => send({ variables: { userID, suggestion: chosenSuggestion } })}
            >
                Empfehlung senden
            </DisableableButton>
        </HStack>
    );
}
