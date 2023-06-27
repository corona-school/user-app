import { DateTime } from 'luxon';
import { Box, HStack, VStack, Text, Pressable, useBreakpointValue, Image, useTheme, Row } from 'native-base';
import { useTranslation } from 'react-i18next';
import Tag from './Tag';
import { LFTag, TrafficStatus } from '../types/lernfair/Course';
import CourseTrafficLamp from '../widgets/CourseTrafficLamp';

type GroupTileProps = {
    courseId: number;
    imageURL?: string;
    tags?: LFTag[];
    start?: string;
    courseTitle: string;
    courseStatus: TrafficStatus;
    next: (id: number, isCourse?: boolean) => void;
};

const GroupTile: React.FC<GroupTileProps> = ({ courseId, imageURL, tags, start, courseTitle, courseStatus, next }) => {
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
        <Box>
            <Pressable onPress={() => next(courseId, true)} width="100%" height="100%" backgroundColor="primary.100" borderRadius="15px">
                <HStack w="100%">
                    <Box mr="3" h="100%">
                        <Box h="100%" w={containerWidth} padding={space['0.5']}>
                            <Image
                                position="absolute"
                                left={0}
                                right={0}
                                top={0}
                                width="100%"
                                height="100%"
                                bg="gray.400"
                                alt={'Kursbild'}
                                source={{
                                    uri: imageURL,
                                }}
                                borderTopLeftRadius="15px"
                                borderBottomLeftRadius="15px"
                            />
                            {courseStatus && <CourseTrafficLamp status={courseStatus || 'full'} hideText showBorder paddingY={0} />}
                        </Box>
                    </Box>
                    <VStack space="1" my="2">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            <Text>
                                {start
                                    ? t('appointment.create.date', {
                                          date: DateTime.fromISO(start).toFormat('dd.MM.yy'),
                                          time: DateTime.fromISO(start).toFormat('HH:mm'),
                                      })
                                    : t('appointment.create.noAppointments')}
                            </Text>
                            <Text bold ellipsizeMode="tail" numberOfLines={5}>
                                {courseTitle}
                            </Text>
                        </VStack>
                        <Row paddingTop="5px" space={space['0.5']} flexWrap="wrap" maxWidth={isMobile ? 200 : 'full'}>
                            {tags?.map((tag, i) => (
                                <Tag key={`tag-${i}`} text={tag.name} />
                            ))}
                        </Row>
                    </VStack>
                </HStack>
            </Pressable>
        </Box>
    );
};

export default GroupTile;
