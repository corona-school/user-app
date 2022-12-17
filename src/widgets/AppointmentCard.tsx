import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Row,
    useTheme,
    Box,
    Flex,
    Button,
    Link,
    Image,
    Column,
    useBreakpointValue,
    Pressable,
    Heading,
    CheckCircleIcon,
    Tooltip,
    Container,
} from 'native-base';
import Card from '../components/Card';
import Tag from '../components/Tag';
import CommunityUser from './CommunityUser';
import { toTimerString } from '../Utility';
import useInterval from '../hooks/useInterval';
import { LFTag, TrafficStatus } from '../types/lernfair/Course';
import { DateTime } from 'luxon';

import LFTimerIcon from '../assets/icons/lernfair/lf-timer.svg';
import CSSWrapper from '../components/CSSWrapper';
import CourseTrafficLamp from './CourseTrafficLamp';

type Props = {
    tags?: LFTag[];
    date?: string;
    title: string;
    description: string;
    child?: string;
    avatar?: string;
    avatarname?: string;
    button?: ReactNode;
    buttonlink?: string;
    variant?: 'card' | 'horizontal';
    isTeaser?: boolean;
    isGrid?: boolean;
    isSpaceMarginBottom?: boolean;
    isFullHeight?: boolean;
    isHorizontalCardCourseChecked?: boolean;
    image?: string;
    onPressToCourse?: () => any;
    videoButton?: ReactNode | ReactNode[];
    countCourse?: number;
    showTrafficLight?: boolean;
    trafficLightStatus?: TrafficStatus;
};

const AppointmentCard: React.FC<Props> = ({
    tags,
    date: _date,
    title,
    countCourse,
    description,
    child,
    variant = 'card',
    avatar,
    avatarname,
    button,
    buttonlink,
    isTeaser = false,
    isGrid = false,
    isSpaceMarginBottom = true,
    isFullHeight = false,
    isHorizontalCardCourseChecked = false,
    image,
    onPressToCourse,
    showTrafficLight,
    trafficLightStatus,
    videoButton,
}) => {
    const { space, sizes } = useTheme();
    const [remainingTime, setRemainingTime] = useState<string>('00:00');

    const date = _date && DateTime.fromISO(_date);

    useEffect(() => {
        date && setRemainingTime(toTimerString(date.toMillis(), Date.now()));
    }, [date]);

    useInterval(() => {
        date && setRemainingTime(toTimerString(date.toMillis(), Date.now()));
    }, 1000);

    const textColor = useMemo(() => (isTeaser ? 'lightText' : 'darkText'), [isTeaser]);

    const CardMobileDirection = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    const CardMobileImage = useBreakpointValue({
        base: '100%',
        lg: '300px',
    });

    const CardMobilePadding = useBreakpointValue({
        base: space['1'],
        lg: '30px',
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const ButtonVideoContainer = useBreakpointValue({
        base: '100%',
        lg: '250px',
    });

    const ButtonVideoContainerMargin = useBreakpointValue({
        base: '0',
        lg: 'auto',
    });

    const teaserHeadline = useBreakpointValue({
        base: '15px',
        lg: '16px',
    });

    const teaserImage = useBreakpointValue({
        base: '160px',
        lg: 'auto',
    });

    const headline = useBreakpointValue({
        base: '13px',
        lg: '14px',
    });

    const buttonteaser = useBreakpointValue({
        base: space['2'],
        lg: 0,
    });

    const buttonteaserSpace = useBreakpointValue({
        base: space['1'],
        lg: '32px',
    });

    return (
        <View height={isFullHeight ? '100%' : 'auto'}>
            {variant === 'card' ? (
                <Card flexibleWidth={isTeaser || isGrid ? true : false} variant={isTeaser ? 'dark' : 'normal'}>
                    <Pressable onPress={onPressToCourse}>
                        <Column w="100%" flexDirection={isTeaser ? CardMobileDirection : 'column'}>
                            <Box w={isTeaser ? CardMobileImage : 'auto'} h={isTeaser ? teaserImage : '121'} padding={space['1']}>
                                <Image
                                    position="absolute"
                                    left={0}
                                    right={0}
                                    top={0}
                                    width="100%"
                                    bgColor="gray.300"
                                    height="100%"
                                    alt={title}
                                    source={{
                                        uri: image,
                                    }}
                                />
                                {showTrafficLight && <CourseTrafficLamp status={trafficLightStatus || 'full'} hideText showBorder paddingY={0} />}
                                {isTeaser && (
                                    <Row space={space['0.5']} flexWrap="wrap" maxWidth="280px">
                                        {tags?.map((tag, i) => (
                                            <Tag key={`tag-${i}`} text={tag.name} />
                                        ))}
                                    </Row>
                                )}
                            </Box>

                            <Box padding={isTeaser ? CardMobilePadding : space['1']} maxWidth="731px">
                                {!isTeaser && date && (
                                    <>
                                        <Row paddingTop="4px" space={1}>
                                            <Text color={textColor}>{date.toFormat('dd.MM.yyyy')}</Text>
                                            <Text color={textColor}>•</Text>
                                            <Text color={textColor}>{date.toFormat('HH:mm')} Uhr</Text>
                                        </Row>
                                    </>
                                )}
                                {date && isTeaser && (
                                    <Row marginBottom={space['1']} alignItems="center">
                                        <Column marginRight="10px">
                                            <Text>{<LFTimerIcon />}</Text>
                                        </Column>
                                        <Column>
                                            <Row>
                                                <Text color={textColor}>Startet in: </Text>
                                                <Text bold color="primary.400">
                                                    {remainingTime}
                                                </Text>
                                            </Row>
                                        </Column>
                                    </Row>
                                )}

                                <Heading color={textColor} bold fontSize={isTeaser ? teaserHeadline : headline} mt="5px" mb={space['0.5']}>
                                    {title}
                                </Heading>

                                {isTeaser && (
                                    <>
                                        <Text paddingBottom={space['1']} color={textColor}>
                                            {description?.length > 56 ? description.substring(0, 56) + '...' : description}
                                        </Text>
                                    </>
                                )}

                                {!isTeaser && (
                                    <Row paddingTop="5px" space={space['0.5']} flexWrap="wrap" maxWidth="280px">
                                        {tags?.map((tag, i) => (
                                            <Tag key={`tag-${i}`} text={tag.name} />
                                        ))}
                                    </Row>
                                )}

                                {child && <CommunityUser name={child} />}

                                {button && (
                                    <Link href={buttonlink}>
                                        <Button width={ButtonContainer} paddingTop={space['1.5']} paddingBottom={space['1.5']}>
                                            {button}
                                        </Button>
                                    </Link>
                                )}
                            </Box>

                            <Box
                                flex="1"
                                maxWidth={ButtonVideoContainer}
                                marginLeft={ButtonVideoContainerMargin}
                                alignItems="flex-end"
                                justifyContent="center"
                                paddingX={space['1']}
                                paddingRight={buttonteaserSpace}
                                marginBottom={buttonteaser}
                            >
                                {isTeaser && (
                                    <Button width="100%" onPress={onPressToCourse}>
                                        Zum Kurs
                                    </Button>
                                )}

                                {isTeaser && videoButton}
                            </Box>
                        </Column>
                    </Pressable>
                </Card>
            ) : (
                <Pressable onPress={onPressToCourse} width="100%" height="100%" backgroundColor="primary.100" borderRadius="15px">
                    <Flex flexDirection="row" height="100%" marginBottom={isSpaceMarginBottom ? space['1'] : '0'}>
                        <Box width="26%" display="block" marginRight="3px" position={'relative'}>
                            <Image
                                width="120px"
                                height="100%"
                                borderTopLeftRadius="15px"
                                borderBottomLeftRadius="15px"
                                bgColor="gray.300"
                                source={{
                                    uri: image,
                                }}
                            />
                            {showTrafficLight && (
                                <Box position="absolute" top={space['0.5']} left={space['0.5']}>
                                    <CourseTrafficLamp status={trafficLightStatus || 'full'} hideText showBorder paddingY={0} />
                                </Box>
                            )}
                        </Box>

                        <Box width="72%" paddingX="10px" paddingY={space['1.5']}>
                            <Row space={1} marginTop={space['0.5']}>
                                {date && (
                                    <Text>
                                        {'Ab'} {date.toFormat('dd.MM.yyyy')}
                                    </Text>
                                )}
                                {date && countCourse && (
                                    <>
                                        <Text>•</Text>
                                        <Text>
                                            {countCourse} {'Termine'}
                                        </Text>
                                    </>
                                )}
                            </Row>
                            <Text bold fontSize={'md'} mt="4px" mb={space['1']}>
                                {title}
                            </Text>

                            <CSSWrapper className="course-list__item-tags">
                                <Row space={space['0.5']} flexWrap="wrap">
                                    {tags?.map((tag, i) => (
                                        <Tag key={`tag-${i}`} text={tag.name} />
                                    ))}
                                </Row>
                            </CSSWrapper>
                        </Box>
                        {isHorizontalCardCourseChecked && (
                            <Box position="absolute" right="20px" bottom="13px">
                                <Tooltip label="Du bist bereits angemeldet.">
                                    <CheckCircleIcon color="danger.100" size="20px" />
                                </Tooltip>
                            </Box>
                        )}
                    </Flex>
                </Pressable>
            )}
        </View>
    );
};
export default AppointmentCard;
