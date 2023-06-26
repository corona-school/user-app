import { Box, HStack, VStack, Text, Center, Pressable, useBreakpointValue } from 'native-base';
import PupilAvatar from '../../../assets/icons/lernfair/avatar_pupil_56.svg';
import Tag from '../../../components/Tag';
import { LFPupil } from '../../../types/lernfair/User';
import { useMemo } from 'react';
import { Pupil_Schooltype_Enum } from '../../../gql/graphql';
import { useTranslation } from 'react-i18next';

type MatchTileProps = {
    matchId: number;
    schooltype: Pupil_Schooltype_Enum | undefined;
    grade: string;
    pupil: LFPupil;
    subjects?: string[];
    next: (id: number, isCourse?: boolean) => void;
};

const MatchTile: React.FC<MatchTileProps> = ({ matchId, schooltype, grade, pupil, subjects, next }) => {
    const { t } = useTranslation();

    const containerWidth = useBreakpointValue({
        base: 100,
        lg: 120,
    });

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const schoolCapitalized = useMemo(() => {
        if (!schooltype || schooltype === Pupil_Schooltype_Enum.Other) return;
        return t(`lernfair.schooltypes.${schooltype}`);
    }, [schooltype, t]);

    return (
        <Box>
            <Pressable onPress={() => next(matchId, false)} width="100%" height="100%" backgroundColor="primary.100" borderRadius="15px">
                <HStack w="100%">
                    <Box mr="3" h="100%">
                        <Center bg="primary.900" width={containerWidth} height="100%" borderTopLeftRadius="15px" borderBottomLeftRadius="15px">
                            <PupilAvatar />
                        </Center>
                    </Box>
                    <VStack space="1" my="2">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            <Text>
                                {schooltype && schoolCapitalized ? t('matching.shared.schoolGrade', { schooltype: schoolCapitalized, grade: grade }) : grade}
                            </Text>
                            <Text bold ellipsizeMode="tail" numberOfLines={5}>
                                {Object.values(pupil).join(' ')}
                            </Text>
                        </VStack>
                        <HStack space={2} maxW={isMobile ? 200 : 'full'}>
                            {subjects?.map((subject) => (
                                <Tag key={`subject tag ${subject}`} text={subject} />
                            ))}
                        </HStack>
                    </VStack>
                </HStack>
            </Pressable>
        </Box>
    );
};

export default MatchTile;
