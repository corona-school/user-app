import { DateTime } from 'luxon';
import { Box, HStack, VStack, Text, Pressable, useBreakpointValue, Image, useTheme, Row } from 'native-base';
import { useTranslation } from 'react-i18next';
import Tag from '../../components/Tag';
import { Course, Course_Tag, Lecture, Subcourse } from '../../gql/graphql';
import { SubcourseForScreening } from '../../types';

export function SubcourseCard({ subcourse, onClick }: { subcourse: SubcourseForScreening; onClick?: () => void }) {
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
            <Pressable onPress={onClick} width="100%" height="100%" backgroundColor="primary.100" borderRadius="15px">
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
                                    uri: subcourse.course.image!,
                                }}
                                borderTopLeftRadius="15px"
                                borderBottomLeftRadius="15px"
                            />
                            {/* <CourseTrafficLamp status={courseStatus || 'full'} hideText showBorder paddingY={0} /> */}
                        </Box>
                    </Box>
                    <VStack space="1" my="2">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            <Text>
                                {subcourse.nextLecture
                                    ? t('appointment.create.date', {
                                          date: DateTime.fromISO(subcourse.nextLecture.start).toFormat('dd.MM.yy'),
                                          time: DateTime.fromISO(subcourse.nextLecture.start).toFormat('HH:mm'),
                                      })
                                    : t('appointment.create.noAppointments')}
                            </Text>
                            <Text bold ellipsizeMode="tail" numberOfLines={5}>
                                {subcourse.course.name}
                            </Text>
                        </VStack>
                        <Row paddingTop="5px" space={space['0.5']} flexWrap="wrap" maxWidth={isMobile ? 200 : 'full'}>
                            {subcourse.course.tags?.map((tag, i) => (
                                <Tag key={`tag-${i}`} text={tag.name} />
                            ))}
                        </Row>
                    </VStack>
                </HStack>
            </Pressable>
        </Box>
    );
}
