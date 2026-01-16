import { Box, Center, HStack, Pressable, Text, useBreakpointValue, useTheme, VStack } from 'native-base';

import { useTranslation } from 'react-i18next';

import StudentAvatar from '../../assets/icons/lernfair/avatar_student_56.svg';
import Tag from '../../components/Tag';
import { MatchWithStudent } from '../../types';
import { Dissolve_Reason, Dissolved_By_Enum } from '../../gql/graphql';

export function MatchStudentCard({ match }: { match: MatchWithStudent }) {
    const { space } = useTheme();
    const { t } = useTranslation();

    const containerWidth = useBreakpointValue({
        base: 100,
        lg: 120,
    });

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const labelForDissolver = (dissolvedBy: Dissolved_By_Enum) => {
        switch (dissolvedBy) {
            case Dissolved_By_Enum.Admin:
                return 'Admin';
            case Dissolved_By_Enum.Pupil:
                return 'Schüler:in';
            case Dissolved_By_Enum.Student:
                return 'Helfer:in';
            case Dissolved_By_Enum.Unknown:
                return 'Unbekannt';
        }
    };

    const reasonForDissolver = (dissolvedBy: Dissolved_By_Enum, reason: Dissolve_Reason) => {
        let userType = dissolvedBy === Dissolved_By_Enum.Pupil ? 'pupil' : 'student';
        const reasonText = t(`matching.dissolveReasons.${userType}.${reason}` as unknown as TemplateStringsArray);
        if (reason === Dissolve_Reason.Other) {
            return `${reasonText} (${match?.otherDissolveReason})`;
        }
    };

    return (
        <HStack minW="300">
            <Pressable
                onPress={() => {}}
                width="100%"
                height="100%"
                backgroundColor={match!.dissolved ? 'white' : 'primary.100'}
                borderColor={match!.dissolved ? 'primary.100' : ''}
                borderWidth={match!.dissolved ? '2' : '0'}
                borderRadius="15px"
            >
                <HStack>
                    <Box mr="3">
                        <Center
                            bg={match!.dissolved ? 'primary.300' : 'primary.900'}
                            width={containerWidth}
                            height="100%"
                            borderTopLeftRadius="15px"
                            borderBottomLeftRadius="15px"
                        >
                            <StudentAvatar />
                        </Center>
                    </Box>
                    <VStack space="1" my="2" maxW="100%" minW="200">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            <Text bold ellipsizeMode="tail" numberOfLines={5}>
                                {match!.student!.firstname} {match!.student!.lastname}
                            </Text>
                        </VStack>
                        <HStack space={space['0.5']} flexWrap="wrap" mr="3">
                            {match!.subjectsFormatted.map((subject, id) => (
                                <Tag key={`subject tag ${subject.name}`} text={subject.name} />
                            ))}
                        </HStack>
                        <Text>
                            {t('since')} {new Date(match!.createdAt).toLocaleDateString()}
                        </Text>
                        {match!.dissolvedAt && (
                            <Text>
                                {t('till')} {new Date(match!.dissolvedAt).toLocaleDateString()}
                            </Text>
                        )}
                        {match!.dissolvedBy && <Text>{t('screening.dissolved_by', { dissolver: labelForDissolver(match!.dissolvedBy) })}</Text>}
                        {match!.dissolveReasons?.map((reason) => (
                            <Text>{t('screening.dissolve_reason', { reason: reasonForDissolver(match!.dissolvedBy!, reason) })}</Text>
                        ))}
                    </VStack>
                </HStack>
            </Pressable>
        </HStack>
    );
}
