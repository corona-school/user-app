import { useQuery } from "@apollo/client";
import CenterLoadingSpinner from "../../components/CenterLoadingSpinner";
import WithNavigation from "../../components/WithNavigation";
import { gql } from "../../gql";
import { Button, Column, HStack } from "native-base";
import HSection from "../../widgets/HSection";
import { useState } from "react";
import { CreateTopicModal, MatchInfo } from "../../modals/learning/CreateTopicModal";
import { LearningTopicCard } from "../../widgets/learning/LearningTopicCard";


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

    return <WithNavigation>
        <Column padding={'10px'}>
        {loading && <CenterLoadingSpinner />}
        {!loading && data?.me.pupil?.matches.map(match => <>
            <HSection title={`Lerne mit ${match.student.firstname}`}>
                {match.topics.map(topic => <LearningTopicCard topic={topic} />)}
            </HSection>
            <HStack>
                <Button variant="outline" onPress={() => setCreateTopicFor(match)}>Neues Thema</Button> 
            </HStack>
        </>)}
        
        </Column>

        {createTopicFor && <CreateTopicModal match={createTopicFor} onClose={() => { setCreateTopicFor(undefined); refetch(); }} />}
    </WithNavigation>
}