import { ReactElement, ReactNode, useMemo, useRef, useState } from 'react';
import {
    Badge,
    Box,
    Button as NativeBaseButton,
    CheckCircleIcon,
    Column,
    Flex,
    Heading,
    HStack,
    Image,
    Link,
    Pressable,
    Row,
    Stack,
    Text,
    Tooltip,
    useBreakpointValue,
    useTheme,
    View,
    VStack,
} from 'native-base';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { formatDate, getGradeLabel, toTimerString } from '../Utility';
import useInterval from '../hooks/useInterval';
import { TrafficStatus } from '../types/lernfair/Course';
import { DateTime } from 'luxon';

import LFTimerIcon from '../assets/icons/lernfair/lf-timer.svg';
import SandClockIcon from '../assets/icons/lernfair/Icon_SandClock_small.svg';
import CSSWrapper from '../components/CSSWrapper';
import CourseTrafficLamp from './CourseTrafficLamp';
import { useTranslation } from 'react-i18next';
import { useUserType } from '../hooks/useApollo';
import MatchAvatarImage from '../components/MatchAvatarImage';
import VideoButton from '../components/VideoButton';
import { Course_Category_Enum, Instructor, Lecture, Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { Typography } from '@/components/Typography';
import { asTranslationKey } from '@/helper/string-helper';
import { IconCopyPlus } from '@tabler/icons-react';
import { Button } from '@/components/Button';

type Props = {
    appointmentId?: number;
    subcourseId?: number;
    appointmentType?: Lecture_Appointmenttype_Enum;
    isOrganizer?: boolean;
    tags?: { name: string }[];
    dateNextLecture?: string;
    duration?: number; // in minutes
    title: string;
    description: string;
    maxParticipants?: number;
    participantsCount?: number;
    publishedAt?: Date;
    minGrade?: number;
    maxGrade?: number;
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
    isMatch?: boolean;
    onPressToCourse?: () => any;
    onPressDuplicate?: () => any;
    hasVideoButton?: boolean;
    countCourse?: number;
    statusText?: string;
    showTrafficLight?: boolean;
    showStatus?: boolean;
    showCourseTraffic?: boolean;
    showSchoolclass?: boolean;
    showInformationForScreeners?: boolean;
    trafficLightStatus?: TrafficStatus;
    instructors?: Instructor[];
    firstLecture?: Lecture;
    courseCategory?: Course_Category_Enum;
};

const AppointmentCard: React.FC<Props> = ({
    appointmentId,
    subcourseId,
    appointmentType,
    tags,
    dateNextLecture: _dateNext,
    duration,
    title,
    countCourse,
    statusText,
    description,
    maxParticipants,
    participantsCount,
    publishedAt,
    minGrade,
    maxGrade,
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
    isMatch,
    onPressToCourse,
    onPressDuplicate,
    showTrafficLight,
    showStatus,
    showCourseTraffic,
    showSchoolclass,
    showInformationForScreeners,
    trafficLightStatus,
    hasVideoButton,
    isOrganizer,
    instructors,
    firstLecture,
    courseCategory,
}) => {
    const { space, sizes } = useTheme();
    const { t, i18n } = useTranslation();
    const [currentTime, setCurrentTime] = useState(Date.now());
    const userType = useUserType();
    const dateNextLecture = _dateNext && DateTime.fromISO(_dateNext);

    useInterval(() => {
        setCurrentTime(Date.now());
    }, 1000);

    const rootRef = useRef<HTMLElement>();
    const rememberScroll = useScrollRestoration({ ref: rootRef, scrollGroup: 'subcourse', scrollId: subcourseId + '' });

    function onPress() {
        if (subcourseId) {
            rememberScroll();
        }

        onPressToCourse?.();
    }

    let remainingTime: string | null = null;
    let ongoingTime: string | null = null;
    let ended = false;

    if (dateNextLecture) {
        if (currentTime < dateNextLecture.toMillis()) {
            // appointment not yet started
            remainingTime = toTimerString(DateTime.fromMillis(currentTime), dateNextLecture);
        } else if (duration && currentTime < dateNextLecture.toMillis() + duration * 60 * 1000) {
            // appointment not yet ended -> ongoing
            ongoingTime = '' + Math.floor((currentTime - dateNextLecture.toMillis()) / 1000 / 60) + ' Minuten';
        } else {
            ended = true;
        }
    }

    const seatsLeft: number | undefined = useMemo(() => {
        if (!maxParticipants) return;
        if (!participantsCount) return;
        return maxParticipants - participantsCount;
    }, [maxParticipants, participantsCount]);

    const isCurrent = useCanJoinMeeting(isOrganizer ? 240 : 10, _dateNext, duration);
    const textColor = useMemo(() => (isTeaser && isCurrent ? 'lightText' : 'darkText'), [isCurrent, isTeaser]);

    const CardMobileDirection = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    const CardMobileImage = useBreakpointValue({
        base: '100%',
        lg: isMatch ? '200px' : '300px',
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

    const today = new Date();
    const aWeekAgo = today.setDate(today.getDate() - 7);
    const isCourseNewlyAdded = publishedAt?.getTime() ?? new Date(0).getTime() > aWeekAgo;
    const showHomeworkHelpInformation = courseCategory === Course_Category_Enum.HomeworkHelp;

    return (
        <View ref={rootRef} height={isFullHeight ? '100%' : 'auto'}>
            {variant === 'card' ? (
                <Card flexibleWidth={isTeaser || isGrid} width={isTeaser ? 'full' : '300px'} variant={isTeaser && isCurrent ? 'dark' : 'normal'}>
                    <Pressable onPress={onPress}>
                        <VStack w="100%" flexDirection={isTeaser ? CardMobileDirection : 'column'}>
                            <Box w={isTeaser ? CardMobileImage : 'auto'} h={isTeaser ? teaserImage : '121'} padding={space['1']} mt={isMatch ? '3' : 0}>
                                <VStack position="absolute" left={0} right={0} top={0} width="100%" height="100%">
                                    {onPressDuplicate && (
                                        <Button
                                            className="absolute top-4 right-4 z-10 rounded-full w-10 h-10 bg-black/20 hover:bg-black/40 active:bg-black/60"
                                            variant="none"
                                            onClick={onPressDuplicate}
                                        >
                                            <IconCopyPlus className="stroke-white" />
                                        </Button>
                                    )}
                                    {!isMatch && (
                                        <Image
                                            width="100%"
                                            bgColor="gray.300"
                                            height="100%"
                                            alt={title}
                                            source={{
                                                uri: image,
                                            }}
                                        />
                                    )}
                                </VStack>
                                {showTrafficLight && <CourseTrafficLamp status={trafficLightStatus || 'full'} hideText showBorder paddingY={0} />}
                                {isTeaser && (
                                    <Row space={space['0.5']} flexWrap="wrap" maxWidth="280px">
                                        {tags?.map((tag, i) => (
                                            <Tag key={`tag-${i}`} text={tag.name} />
                                        ))}
                                    </Row>
                                )}
                                {isMatch && <MatchAvatarImage />}
                            </Box>

                            <Stack padding={isTeaser ? CardMobilePadding : space['1']} maxWidth="731px" space="2">
                                {!isTeaser && dateNextLecture && (
                                    <>
                                        {isCourseNewlyAdded && (
                                            <Badge bgColor="danger.500" _text={{ color: 'white' }} rounded="full" style={{ maxWidth: '50px' }}>
                                                {t('dashboard.helpers.badges.new')}
                                            </Badge>
                                        )}
                                        <Row paddingTop="4px" space={1}>
                                            <Text color={textColor}>
                                                {dateNextLecture.toLocaleString(
                                                    //check https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-toLocaleString for reference
                                                    DateTime.DATETIME_MED,
                                                    {
                                                        locale: i18n.language,
                                                    }
                                                ) +
                                                    ' ' +
                                                    t('single.global.clock')}
                                            </Text>
                                        </Row>
                                    </>
                                )}
                                {dateNextLecture && isTeaser && (
                                    <Row marginBottom={space['1']} alignItems="center">
                                        <Column marginRight="10px">
                                            <Text>{<LFTimerIcon className="size-7" />}</Text>
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
                                        {!!(minGrade && maxGrade) &&
                                            t('single.courseInfo.class', {
                                                minGrade: getGradeLabel(minGrade),
                                                maxGrade: getGradeLabel(maxGrade),
                                            })}
                                    </Text>
                                )}

                                {showHomeworkHelpInformation && (
                                    <>
                                        {duration && (
                                            <Typography>
                                                <Typography className="font-bold inline">{t('duration')}: </Typography>
                                                {t(asTranslationKey(`lesson.durations.${duration}`))}
                                            </Typography>
                                        )}
                                        <Typography>
                                            <Typography className="font-bold">{t('single.courseInfo.timesAWeek', { times: 4 })}</Typography>
                                        </Typography>
                                    </>
                                )}

                                {showInformationForScreeners && (
                                    <div className="flex flex-col gap-y-2">
                                        {firstLecture ? (
                                            <Typography>
                                                <span className="font-bold">Kursstart:</span> {formatDate(firstLecture?.start)}
                                            </Typography>
                                        ) : null}
                                        <Typography>
                                            {instructors && instructors?.length ? (
                                                <span>
                                                    <span className="font-bold">Kursleiter:</span> {instructors[0].firstname} {instructors[0].lastname}
                                                </span>
                                            ) : null}
                                        </Typography>
                                    </div>
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

                                {button && (
                                    <Link href={buttonlink}>
                                        <NativeBaseButton width={ButtonContainer} paddingTop={space['1.5']} paddingBottom={space['1.5']}>
                                            {button}
                                        </NativeBaseButton>
                                    </Link>
                                )}
                            </Stack>

                            <Box
                                maxWidth={ButtonVideoContainer}
                                marginLeft={ButtonVideoContainerMargin}
                                alignItems="flex-end"
                                justifyContent="center"
                                paddingX={space['1']}
                                paddingRight={buttonteaserSpace}
                                marginBottom={buttonteaser}
                            >
                                {isTeaser && hasVideoButton && appointmentId && _dateNext && duration && appointmentType && (
                                    <VStack w="100%" space={space['0.5']} marginTop={space[1]}>
                                        <VideoButton
                                            appointmentId={appointmentId}
                                            appointmentType={appointmentType}
                                            startDateTime={_dateNext}
                                            duration={duration}
                                            isInstructor={isOrganizer}
                                            canJoin={isCurrent}
                                            className="w-full h-[47px] rounded-[4px]"
                                        />
                                    </VStack>
                                )}
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
                <Pressable onPress={onPress} width="100%" height="100%" backgroundColor="primary.100" borderRadius="15px">
                    <Flex flexDirection="row" height="100%" marginBottom={isSpaceMarginBottom ? space['1'] : '0'}>
                        {image && (
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
                        )}

                        <Box width="72%" paddingX="10px" paddingY={space['1.5']}>
                            <Row space={1} marginTop={space['0.5']}>
                                {dateNextLecture && (
                                    <Text>
                                        {t('from')} {dateNextLecture.toFormat('dd.MM.yyyy')}
                                    </Text>
                                )}
                                {dateNextLecture && countCourse && (
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
