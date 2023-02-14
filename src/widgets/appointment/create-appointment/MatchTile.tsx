import { Box, HStack, VStack, Text, Center, Pressable, useBreakpointValue } from 'native-base';
import PupilAvatar from '../../../assets/icons/lernfair/avatar_pupil_56.svg';
import Tag from '../../../components/Tag';
import { LFPupil } from '../../../types/lernfair/User';

type MatchTileProps = {
    matchId?: number;
    schooltype: string;
    grade: string;
    pupil: LFPupil;
    subjects?: string[];
    next: (id?: number) => void;
};

const MatchTile: React.FC<MatchTileProps> = ({ matchId, schooltype, grade, pupil, subjects, next }) => {
    const containerWidth = useBreakpointValue({
        base: 100,
        lg: 120,
    });

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    return (
        <Box>
            <Pressable onPress={() => next(matchId)} width="100%" height="100%" backgroundColor="primary.100" borderRadius="15px">
                <HStack w="100%">
                    <Box mr="3" h="100%">
                        <Center bg="primary.900" width={containerWidth} height="100%" borderTopLeftRadius="15px" borderBottomLeftRadius="15px">
                            <PupilAvatar />
                        </Center>
                    </Box>
                    <VStack space="1" my="2">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            <Text>{schooltype && `${schooltype} • ${grade}`}</Text>
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
