import { HStack, Stack, VStack, Text, Heading, Box, Image, useTheme, useBreakpointValue } from 'native-base';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tag from '../../components/Tag';
import { Course, Instructor, Subcourse } from '../../gql/graphql';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import Utility, { getTrafficStatus } from '../../Utility';
import CourseTrafficLamp from '../../widgets/CourseTrafficLamp';

type SubcourseDataProps = {
    course: Course;
    subcourse: Subcourse;
};

const SubcourseData: React.FC<SubcourseDataProps> = ({ course, subcourse }) => {
    const { t } = useTranslation();
    const { sizes } = useTheme();
    const { isMobile } = useLayoutHelper();

    const ImageHeight = useBreakpointValue({
        base: '178px',
        lg: '300px',
    });

    const ContainerWidth = useBreakpointValue({
        base: 'full',
        lg: '50%',
    });

    const seatsLeft: number = useMemo(() => {
        return subcourse?.maxParticipants - subcourse?.participantsCount;
    }, []);

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'}>
                <VStack space="3" width={ContainerWidth}>
                    <HStack space="3">
                        {course?.tags?.map((tag: { name: string; category: string }) => (
                            <VStack>
                                <Tag text={tag.name} />
                            </VStack>
                        ))}
                    </HStack>
                    <Text>
                        {t('single.global.clockFrom')} {Utility.formatDate(subcourse?.lectures[0].start)} {t('single.global.clock')}
                    </Text>
                    <Heading fontSize="3xl" maxW={isMobile ? 'full' : '80%'}>
                        {course?.name}
                    </Heading>
                    {subcourse?.instructors && subcourse?.instructors[0] && (
                        <Heading fontSize="md">{subcourse?.instructors.map((it: Instructor) => `${it.firstname} ${it.lastname}`).join(', ')}</Heading>
                    )}
                    <Text maxWidth={sizes['imageHeaderWidth']}>
                        <Text bold>{t('single.courseInfo.grade')}</Text>
                        {t('single.courseInfo.class', { minGrade: subcourse?.minGrade, maxGrade: subcourse?.maxGrade })}
                    </Text>
                    <CourseTrafficLamp status={getTrafficStatus(subcourse?.participantsCount, subcourse?.maxParticipants)} seatsLeft={seatsLeft} />
                </VStack>

                <Stack width={ContainerWidth}>
                    <Box maxWidth={sizes['imageHeaderWidth']} height={ImageHeight}>
                        <Image
                            alt={course?.name}
                            borderRadius="8px"
                            position="absolute"
                            w="100%"
                            height="100%"
                            bgColor="gray.300"
                            source={{
                                uri: course?.image!,
                            }}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default SubcourseData;
