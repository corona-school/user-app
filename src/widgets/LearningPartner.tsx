import { Text, useTheme, Box, Pressable, useBreakpointValue, HStack, Center, VStack, Row } from 'native-base';

import { useTranslation } from 'react-i18next';
import Tag from '../components/Tag';
import { Pupil_Schooltype_Enum, Subject } from '../gql/graphql';

import PupilAvatar from '../assets/icons/lernfair/avatar_pupil_56.svg';
import StudentAvatar from '../assets/icons/lernfair/avatar_student_56.svg';
import { useNavigate } from 'react-router-dom';
import { useUserType } from '../hooks/useApollo';
import { useMemo } from 'react';

type LearningPartnerProps = {
    matchId: number;
    name: string;
    subjects: Subject[];
    schooltype?: Pupil_Schooltype_Enum | undefined;
    grade?: string;
    isDissolved?: boolean;
};

const LearningPartner: React.FC<LearningPartnerProps> = ({ matchId, name, subjects, schooltype, grade, isDissolved }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const userType = useUserType();
    const navigate = useNavigate();

    console.log('SCHULE', schooltype);
    const containerWidth = useBreakpointValue({
        base: 100,
        lg: 120,
    });

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const schoolCapitalized = useMemo(() => schooltype && schooltype.charAt(0).toUpperCase() + schooltype.slice(1), []);

    return (
        <HStack minW="300">
            <Pressable
                onPress={() => navigate(`/match/${matchId}`)}
                width="100%"
                height="100%"
                backgroundColor={isDissolved ? 'white' : 'primary.100'}
                borderColor={isDissolved ? 'primary.100' : ''}
                borderWidth={isDissolved ? '2' : '0'}
                borderRadius="15px"
            >
                <HStack>
                    <Box mr="3">
                        <Center
                            bg={isDissolved ? 'primary.300' : 'primary.900'}
                            width={containerWidth}
                            height="100%"
                            borderTopLeftRadius="15px"
                            borderBottomLeftRadius="15px"
                        >
                            {userType === 'pupil' ? <StudentAvatar /> : <PupilAvatar />}
                        </Center>
                    </Box>
                    <VStack space="1" my="2" maxW="300">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            {userType === 'pupil' ? (
                                <Text>Tutor:in, Kursleiter:in</Text>
                            ) : (
                                <Text>{schooltype ? t('matching.shared.schoolGrade', { schooltype: schoolCapitalized, grade: grade }) : grade}</Text>
                            )}
                            <Text bold ellipsizeMode="tail" numberOfLines={5}>
                                {name}
                            </Text>
                        </VStack>
                        <HStack space={space['0.5']} flexWrap="wrap" mr="3">
                            {subjects.map((subject) => (
                                <Tag key={`subject tag ${subject.name}`} text={subject.name} />
                            ))}
                        </HStack>
                    </VStack>
                </HStack>
            </Pressable>
        </HStack>
    );
};
export default LearningPartner;
