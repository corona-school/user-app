import { Text, useTheme, Box, Pressable, useBreakpointValue, HStack, Center, VStack } from 'native-base';

import { useTranslation } from 'react-i18next';

import StudentAvatar from '../../assets/icons/lernfair/avatar_student_56.svg';
import Tag from '../../components/Tag';
import { MatchWithStudent } from '../../types';

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
                    <VStack space="1" my="2" maxW="300" minW="200">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            <Text bold ellipsizeMode="tail" numberOfLines={5}>
                                {match!.student!.firstname} {match!.student!.lastname}
                            </Text>
                        </VStack>
                        <HStack space={space['0.5']} flexWrap="wrap" mr="3">
                            {match!.subjectsFormatted.map((subject) => (
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
                    </VStack>
                </HStack>
            </Pressable>
        </HStack>
    );
}
