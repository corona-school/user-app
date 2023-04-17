import { ReactElement, ReactNode, useMemo, useState } from 'react';
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
    HStack,
    VStack,
    Stack,
} from 'native-base';
import Card from '../components/Card';
import Tag from '../components/Tag';
import CommunityUser from './CommunityUser';
import { toTimerString } from '../Utility';
import useInterval from '../hooks/useInterval';
import { TrafficStatus } from '../types/lernfair/Course';
import { DateTime } from 'luxon';

import LFTimerIcon from '../assets/icons/lernfair/lf-timer.svg';
import SandClockIcon from '../assets/icons/lernfair/Icon_SandClock_small.svg';
import CSSWrapper from '../components/CSSWrapper';
import CourseTrafficLamp from './CourseTrafficLamp';
import { useTranslation } from 'react-i18next';
import { useUserType } from '../hooks/useApollo';

type Props = {
    tags?: { name: string }[];
    date?: string;
    duration?: number; // in minutes
    title: string;
    description: string;
    maxParticipants?: number;
    participantsCount?: number;
    minGrade?: number;
    maxGrade?: number;
    child?: string;
    avatar?: ReactElement;
    avatarname?: string;
    button?: ReactNode;
    buttonlink?: string;
    variant?: 'card' | 'horizontal';
    isTeaser?: boolean;
    isGrid?: boolean;
    isSpaceMarginBottom?: boolean;
    isFullHeight?: boolean;
    isHorizontalCardCourseChecked?: boolean;
    isOnWaitinglist?: boolean;
    image?: string;
    onPressToCourse?: () => any;
    videoButton?: ReactNode | ReactNode[];
    countCourse?: number;
    statusText?: string;
    showTrafficLight?: boolean;
    showStatus?: boolean;
    showCourseTraffic?: boolean;
    showSchoolclass?: boolean;
    trafficLightStatus?: TrafficStatus;
};

const AppointmentCard: React.FC<Props> = ({
    tags,
    date: _date,
    duration,
    title,
    countCourse,
    statusText,
    description,
    maxParticipants,
    participantsCount,
    minGrade,
    maxGrade,
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
    isOnWaitinglist,
    image,
    onPressToCourse,
    showTrafficLight,
    showStatus,
    showCourseTraffic,
    showSchoolclass,
    trafficLightStatus,
    videoButton,
}) => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const [currentTime, setCurrentTime] = useState(Date.now());
    const userType = useUserType();
    const date = _date && DateTime.fromISO(_date);

    useInterval(() => {
        setCurrentTime(Date.now());
    }, 1000);

    let remainingTime: string | null = null;
    let ongoingTime: string | null = null;
    let ended = false;

    if (date) {
        if (currentTime < date.toMillis()) {
            // appointment not yet started
            remainingTime = toTimerString(date.toMillis(), currentTime);
        } else if (duration && currentTime < date.toMillis() + duration * 60 * 1000) {
            // appointment not yet ended -> ongoing
            ongoingTime = '' + Math.floor((currentTime - date.toMillis()) / 1000 / 60) + ' Minuten';
        } else {
            ended = true;
        }
    }

    const seatsLeft: number | undefined = useMemo(() => {
        if (!maxParticipants) return;
        if (!participantsCount) return;
        return maxParticipants - participantsCount;
    }, [maxParticipants, participantsCount]);

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
        base: '15px',
        lg: '16px',
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
                <Card flexibleWidth={isTeaser || isGrid} width={isTeaser ? 'full' : '300px'} variant={isTeaser ? 'dark' : 'normal'}>
                    <Pressable onPress={onPressToCourse}>
                        <VStack w="100%" flexDirection={isTeaser ? CardMobileDirection : 'column'}>
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

                            <Stack padding={isTeaser ? CardMobilePadding : space['1']} maxWidth="731px" space="2">
                                {!isTeaser && date && (
                                    <>
                                        <Row paddingTop="4px" space={1}>
                                            <Text color={textColor}>
                                                {countCourse && countCourse > 1
                                                    ? t('single.card.dateLectures', {
                                                          date: date.toFormat('dd.MM.yyyy'),
                                                          time: date.toFormat('HH:mm'),
                                                          count: countCourse,
                                                      })
                                                    : t('single.card.oneLecture', {
                                                          date: date.toFormat('dd.MM.yyyy'),
                                                          time: date.toFormat('HH:mm'),
                                                          count: countCourse,
                                                      })}
                                            </Text>
                                        </Row>
                                    </>
                                )}
                                {date && isTeaser && (
                                    <Row marginBottom={space['1']} alignItems="center">
                                        <Column marginRight="10px">
                                            <Text>{<LFTimerIcon />}</Text>
                                        </Column>
                                        <Column>
                                            {remainingTime && (
                                                <Row>
                                                    <Text color={textColor}> {t('single.card.time.notStarted')} </Text>
                                                    <Text bold color="primary.400">
                                                        {remainingTime}
                                                    </Text>
                                                </Row>
                                            )}
                                            {ongoingTime && (
                                                <Row>
                                                    <Text bold color="primary.400">
                                                        {t('single.card.time.ongoing')} {ongoingTime}
                                                    </Text>
                                                </Row>
                                            )}
                                            {ended && (
                                                <Row>
                                                    <Text bold color="primary.400">
                                                        {t('single.card.time.ended')}
                                                    </Text>
                                                </Row>
                                            )}
                                        </Column>
                                    </Row>
                                )}

                                <Heading color={textColor} bold fontSize={isTeaser ? teaserHeadline : headline} mt="5px" mb={space['0.5']}>
                                    {title}
                                </Heading>

                                {showCourseTraffic && (
                                    <Box>
                                        <CourseTrafficLamp
                                            status={trafficLightStatus || 'full'}
                                            showLastSeats={userType === 'student'}
                                            circleSize="12px"
                                            paddingY={0}
                                            seatsLeft={seatsLeft}
                                            seatsFull={participantsCount}
                                            seatsMax={maxParticipants}
                                        />
                                    </Box>
                                )}

                                {showSchoolclass && (
                                    <Text maxWidth={sizes['imageHeaderWidth']}>
                                        <Text bold>{t('single.courseInfo.grade')}</Text>
                                        {t('single.courseInfo.class', { minGrade: minGrade, maxGrade: maxGrade })}
                                    </Text>
                                )}

                                {showStatus && (
                                    <HStack space={'0.5'}>
                                        <Text bold fontSize="md">
                                            {t('single.global.state')}
                                        </Text>
                                        <Text ml="1" fontSize="md">
                                            {statusText}
                                        </Text>
                                    </HStack>
                                )}

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
                            </Stack>

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
                                        {t('single.card.expandCardButton')}
                                    </Button>
                                )}

                                {isTeaser && videoButton}
                            </Box>
                            {isHorizontalCardCourseChecked && (
                                <Box position="absolute" right="20px" bottom="13px">
                                    <Tooltip label={t('single.card.alreadyRegistered')}>
                                        {isOnWaitinglist ? <SandClockIcon /> : <CheckCircleIcon color="danger.100" size="20px" />}
                                    </Tooltip>
                                </Box>
                            )}
                        </VStack>
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
                                        {t('from')} {date.toFormat('dd.MM.yyyy')}
                                    </Text>
                                )}
                                {date && countCourse && (
                                    <>
                                        <Text>•</Text>
                                        <Text>{t('single.card.appointments', { count: countCourse })}</Text>
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
                                <Tooltip label={t('single.card.alreadyRegistered')}>
                                    {isOnWaitinglist ? <SandClockIcon /> : <CheckCircleIcon color="danger.100" size="20px" />}
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
