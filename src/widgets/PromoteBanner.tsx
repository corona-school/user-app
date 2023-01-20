import { Box, Card, Divider, HStack, Spacer, Stack, Text, useBreakpointValue, useTheme, VStack } from 'native-base';
import CourseTrafficLamp from './CourseTrafficLamp';
import PromoteButton from './PromoteButton';
import CheckIcon from '../assets/icons/lernfair/Icon_Done.svg';
import CallIcon from '../assets/icons/lernfair/Icon_Call.svg';
import { useTranslation } from 'react-i18next';
import { TrafficStatus } from '../types/lernfair/Course';

type BannerProps = {
    canNotPromote: boolean;
    isPromoted: boolean;
    courseStatus: TrafficStatus;
    onClick: () => void;
};

const PromoteBanner: React.FC<BannerProps> = ({ canNotPromote, isPromoted, onClick, courseStatus }) => {
    const { t } = useTranslation();
    const { sizes } = useTheme();
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });
    return (
        <Box>
            {canNotPromote ? (
                <CourseTrafficLamp status={courseStatus} paddingY={3} />
            ) : (
                <Card bg="primary.100" maxWidth={sizes['imageHeaderWidth']}>
                    <CourseTrafficLamp status={'free'} paddingY={3} />
                    <Divider />
                    <Stack direction={isMobile ? 'column' : 'row'} py={3} alignItems="center" space={1}>
                        <Stack direction="row" alignItems="center" mb="2">
                            <Box pr="2">{isPromoted ? <CheckIcon /> : <CallIcon />}</Box>
                            {isMobile && <Spacer />}
                            <VStack maxW={isMobile ? '230' : 'full'}>
                                <Text bold fontSize="md">
                                    {isPromoted ? t('single.bannerPromote.promotedTitle') : t('single.bannerPromote.freeTitle')}
                                </Text>
                                <Text fontSize="md">
                                    {isPromoted ? t('single.bannerPromote.promotedDescription') : t('single.bannerPromote.freeDescription')}
                                </Text>
                            </VStack>
                        </Stack>
                        <Spacer />
                        {!isPromoted && <PromoteButton onClick={onClick} />}
                    </Stack>
                </Card>
            )}
        </Box>
    );
};

export default PromoteBanner;
