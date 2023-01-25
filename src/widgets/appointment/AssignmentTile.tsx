import { DateTime } from 'luxon';
import { Box, HStack, VStack, Text, Center, Pressable, useBreakpointValue, Image, useTheme, Spacer } from 'native-base';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_56.svg';
import Tag from '../../components/Tag';
import { LFTag, TrafficStatus } from '../../types/lernfair/Course';
import { LFPupil } from '../../types/lernfair/User';
import CourseTrafficLamp from '../CourseTrafficLamp';

type TileProps = {
    isGroup: boolean;
    schooltype?: string;
    grade?: string;
    pupil?: LFPupil;
    subjects?: string[];
    tags?: LFTag[];
    startDate?: string;
    courseTitle?: string;
    courseStatus?: TrafficStatus;
};

const AssignmentTile: React.FC<TileProps> = ({ isGroup, schooltype, grade, pupil, subjects, tags, startDate, courseTitle, courseStatus }) => {
    const { space } = useTheme();

    const containerWidth = useBreakpointValue({
        base: 100,
        lg: 120,
    });

    return (
        <Box>
            <Pressable onPress={() => console.log('choose this!')} width="100%" height="100%" backgroundColor="primary.100" borderRadius="15px">
                <HStack w="100%">
                    <Box mr="3" h="100%">
                        {isGroup ? (
                            <Box h="100%" w={containerWidth} padding={space['0.5']}>
                                <Image
                                    position="absolute"
                                    left={0}
                                    right={0}
                                    top={0}
                                    width="100%"
                                    height="100%"
                                    alt={'test'}
                                    source={{
                                        uri: 'https://picsum.photos/500',
                                    }}
                                    borderTopLeftRadius="15px"
                                    borderBottomLeftRadius="15px"
                                />
                                {courseStatus && <CourseTrafficLamp status={courseStatus || 'full'} hideText showBorder paddingY={0} />}
                            </Box>
                        ) : (
                            <Center bg="primary.900" width={containerWidth} height="100%" borderTopLeftRadius="15px" borderBottomLeftRadius="15px">
                                <PupilAvatar />
                            </Center>
                        )}
                    </Box>
                    <VStack space="1" my="2">
                        <VStack space="2" mb="2">
                            <Text>
                                {isGroup && startDate ? `${DateTime.fromISO(startDate).setLocale('de').toFormat('Ab DD • t')} Uhr` : `${schooltype} • ${grade}`}
                            </Text>

                            <Text bold>{pupil && !isGroup ? Object.values(pupil).join(' ') : courseTitle}</Text>
                        </VStack>
                        <HStack space={2}>
                            {subjects && subjects?.map((subject) => <Tag text={subject} />)}
                            {tags && tags?.map((tag) => <Tag text={tag.name} />)}
                        </HStack>
                    </VStack>
                </HStack>
            </Pressable>
        </Box>
    );
};

export default AssignmentTile;
