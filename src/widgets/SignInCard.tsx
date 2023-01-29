import { DateTime } from 'luxon';
import { Text, Box, Row, useTheme, Button, Image, Link } from 'native-base';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { Subcourse } from '../gql/graphql';
import { LFSubCourse, LFTag, TrafficStatus } from '../types/lernfair/Course';
import CourseTrafficLamp from './CourseTrafficLamp';

type Props = {
    tags?: LFTag[];
    subcourse: Subcourse;
    onClickSignIn?: () => any;
    flexibleWidth?: boolean;
    onPress?: () => any;
    showTrafficLight?: boolean;
    trafficLightStatus?: TrafficStatus;
};

const SignInCard: React.FC<Props> = ({ tags, subcourse, onClickSignIn, flexibleWidth, onPress, showTrafficLight, trafficLightStatus }) => {
    const { space } = useTheme();

    return (
        <Link height="100%" onPress={onPress} width={flexibleWidth ? '100%' : undefined}>
            <Card isFullHeight={true} width={'100%'}>
                <Box bg="primary.500" h="120" padding={space['0.5']}>
                    <Image
                        position="absolute"
                        left={0}
                        right={0}
                        top={0}
                        width="100%"
                        height="100%"
                        alt={subcourse?.course?.name}
                        source={{
                            uri: subcourse?.course?.image ?? undefined,
                        }}
                    />
                    {showTrafficLight && <CourseTrafficLamp status={trafficLightStatus || 'full'} hideText showBorder paddingY={0} />}
                </Box>
                <Box paddingX={space['1']} paddingY={space['1']} maxWidth="300px">
                    <Row space={1.5}>
                        {subcourse?.lectures && subcourse?.lectures[0] && (
                            <Text>Ab {DateTime.fromISO(subcourse.lectures[0].start).toFormat('dd.MM.yyyy')}</Text>
                        )}
                        <Text>•</Text>
                        <Text>{subcourse.lectures?.length} Termine</Text>
                    </Row>
                    <Text bold maxW={'190px'} fontSize={'md'} paddingTop={space['0.5']} paddingBottom={space['0.5']}>
                        {subcourse?.course?.name}
                    </Text>
                    <Row space={space['0.5']} paddingY={space['0.5']} flexWrap="wrap">
                        {tags?.map((tag, i) => (
                            <Tag key={`tag-${i}`} text={tag.name} />
                        ))}
                    </Row>
                    <Button variant="outline" marginTop={space['1']} onPress={onClickSignIn}>
                        Anmelden
                    </Button>
                </Box>
            </Card>
        </Link>
    );
};
export default SignInCard;
