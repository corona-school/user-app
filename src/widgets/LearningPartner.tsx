import { Text, useTheme, Box, Pressable, useBreakpointValue, HStack, Center, VStack } from 'native-base';

import { useTranslation } from 'react-i18next';
import Tag from '../components/Tag';
import { Pupil_Schooltype_Enum, Subject } from '../gql/graphql';

import PupilAvatar from '../assets/icons/lernfair/avatar_pupil_56.svg';
import StudentAvatar from '../assets/icons/lernfair/avatar_student_56.svg';

type LearningPartnerProps = {
    name: string;
    subjects: Subject[];
    schooltype?: Pupil_Schooltype_Enum | undefined;
    schoolclass?: number;
    grade?: string;
    isStudent?: boolean;
    isPupil?: boolean;
    isDissolved?: boolean;
};

const LearningPartner: React.FC<LearningPartnerProps> = ({ name, subjects, schooltype, schoolclass, grade, isStudent, isDissolved }) => {
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
                onPress={() => console.log('go to match details')}
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
                            {isStudent ? <StudentAvatar /> : <PupilAvatar />}
                        </Center>
                    </Box>
                    <VStack space="1" my="2" maxW="300">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            <Text>{schoolclass ? t('matching.shared.schoolGrade', { schooltype: schooltype, grade: schoolclass }) : grade}</Text>
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
