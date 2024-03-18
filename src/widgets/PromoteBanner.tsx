import { Box, Button, Card, Divider, Spacer, Stack, Text, useBreakpointValue, useTheme, VStack } from 'native-base';
import CourseTrafficLamp from './CourseTrafficLamp';
import CheckIcon from '../assets/icons/lernfair/Icon_Done.svg';
import CallIcon from '../assets/icons/lernfair/Icon_Call.svg';
import { useTranslation } from 'react-i18next';
import { TrafficStatus } from '../types/lernfair/Course';

type BannerProps = {
    isPromoted: boolean;
    seatsFull: number;
    seatsMax: number;
    courseStatus: TrafficStatus;
    onClick: () => void;
};

const PromoteBanner: React.FC<BannerProps> = ({ isPromoted, onClick, courseStatus, seatsFull, seatsMax }) => {
    const { t } = useTranslation();
    const { sizes } = useTheme();
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });
    const buttonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    return (
        <Box>
            <Card bg="primary.100" maxWidth={sizes['imageHeaderWidth']}>
                <CourseTrafficLamp showLastSeats seatsFull={seatsFull} seatsMax={seatsMax} status={courseStatus} paddingY={3} />
                <Divider />
                <Stack direction={isMobile ? 'column' : 'row'} py={3} alignItems={isMobile ? 'flex-start' : 'center'} space={1}>
                    <Stack direction="row" alignItems="center" mb="2">
                        <Box pr="2">{isPromoted ? <CheckIcon /> : <CallIcon />}</Box>
                        {isMobile && <Spacer />}
                        <VStack maxW={isMobile ? '300' : 'full'}>
                            <Text bold fontSize="md">
                                {isPromoted ? t('single.bannerPromote.promotedTitle') : t('single.bannerPromote.freeTitle')}
                            </Text>
                            <Text fontSize="md">{isPromoted ? t('single.bannerPromote.promotedDescription') : t('single.bannerPromote.freeDescription')}</Text>
                        </VStack>
                    </Stack>
                    <Spacer />
                    {!isPromoted && (
                        <Button variant="outline" width={buttonContainer} onPress={onClick}>
                            {t('single.buttonPromote.button')}
                        </Button>
                    )}
                </Stack>
            </Card>
        </Box>
    );
};

export default PromoteBanner;
