import { VStack, Heading, Text, Pressable } from "native-base";
import { useTranslation } from "react-i18next";
import { Course_Subject_Enum, Learning_Topic } from "../../gql/graphql";
import { useNavigate } from "react-router-dom";

export type TopicInfo = Pick<Learning_Topic, 'id' | 'finishedAssignmentsCount' | 'openAssignmentsCount' | 'subject' | 'name'>;

export function LearningTopicCard({ topic }: { topic: TopicInfo }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Pressable onPress={() => navigate(`/learning/topic/${topic.id}`)}>
            <VStack width="288px" height="288px" padding="24px" backgroundColor="primary.900" borderRadius="8px" justifyContent="space-between">
                <VStack>
                    <Text fontSize={12} color="white" noOfLines={1}>
                        {t(`lernfair.subjects.${topic.subject}` as unknown as TemplateStringsArray)}
                    </Text>
                    <Heading color="white" noOfLines={1}>
                        {topic.name}
                    </Heading>
                    <VStack paddingTop="20px">
                        <Text color="white">
                            {topic.openAssignmentsCount} offene Aufgaben
                        </Text>
                        <Text color="white">{topic.finishedAssignmentsCount} erledigte Aufgaben</Text>
                    </VStack>
                </VStack>
            </VStack>
        </Pressable>
    )
}
