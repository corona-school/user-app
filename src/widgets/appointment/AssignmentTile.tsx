import { DateTime } from 'luxon';
import { Box, HStack, VStack, Text, Center, Pressable, useBreakpointValue, Image, useTheme, Row } from 'native-base';
import { useTranslation } from 'react-i18next';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_56.svg';
import Tag from '../../components/Tag';
import { Assignment } from '../../types/lernfair/Appointment';
import { LFTag, TrafficStatus } from '../../types/lernfair/Course';
import { LFPupil } from '../../types/lernfair/User';
import CourseTrafficLamp from '../CourseTrafficLamp';

type BaseProps = {
    next: (id?: number) => void;
    courseId?: number;
};

interface GroupTileProps extends BaseProps {
    type: Assignment.GROUP;
    imageURL?: string;
    tags?: LFTag[];
    start?: string;
    courseTitle: string;
    courseStatus: TrafficStatus;
}

interface MatchTileProps extends BaseProps {
    type: Assignment.MATCH;
    schooltype: string;
    grade: string;
    pupil: LFPupil;
    subjects?: string[];
}

type TileProps = GroupTileProps | MatchTileProps;

const AssignmentTile: React.FC<TileProps> = (props) => {
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
            <Pressable onPress={() => props.next(props.courseId)} width="100%" height="100%" backgroundColor="primary.100" borderRadius="15px">
                <HStack w="100%">
                    <Box mr="3" h="100%">
                        {props.type === Assignment.GROUP ? (
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
                                        uri: props.imageURL,
                                    }}
                                    borderTopLeftRadius="15px"
                                    borderBottomLeftRadius="15px"
                                />
                                {props.courseStatus && <CourseTrafficLamp status={props.courseStatus || 'full'} hideText showBorder paddingY={0} />}
                            </Box>
                        ) : (
                            <Center bg="primary.900" width={containerWidth} height="100%" borderTopLeftRadius="15px" borderBottomLeftRadius="15px">
                                <PupilAvatar />
                            </Center>
                        )}
                    </Box>
                    <VStack space="1" my="2">
                        <VStack space="2" mb="2" maxW={isMobile ? 200 : 'full'}>
                            {props.type === Assignment.GROUP && (
                                <Text>
                                    {props.start
                                        ? `${DateTime.fromISO(props.start).setLocale('de').toFormat('Ab DD • t')} Uhr`
                                        : t('appointment.createAppointment.assignment.noAppointments')}
                                </Text>
                            )}
                            {props.type === Assignment.MATCH && <Text>{props.schooltype && `${props.schooltype} • ${props.grade}`}</Text>}
                            <Text bold ellipsizeMode="tail" numberOfLines={5}>
                                {props.type === Assignment.GROUP ? props.courseTitle : Object.values(props.pupil).join(' ')}
                            </Text>
                        </VStack>
                        <HStack space={2} maxW={isMobile ? 200 : 'full'}>
                            {props.type === Assignment.MATCH && props.subjects?.map((subject, index) => <Tag key={`subject tag ${subject}`} text={subject} />)}
                        </HStack>
                        <Row paddingTop="5px" space={space['0.5']} flexWrap="wrap" maxWidth={isMobile ? 200 : 'full'}>
                            {props.type === Assignment.GROUP && props.tags?.map((tag, i) => <Tag key={`tag-${i}`} text={tag.name} />)}
                        </Row>
                    </VStack>
                </HStack>
            </Pressable>
        </Box>
    );
};

export default AssignmentTile;
