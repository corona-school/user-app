import { Box, Card, Divider, Stack, Text, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import CourseTrafficLamp from './CourseTrafficLamp';
import CheckIcon from '../assets/icons/lernfair/Icon_Done.svg';
import { TrafficStatus } from '../types/lernfair/Course';

type BannerProps = {
    courseStatus: TrafficStatus;
    seatsLeft: number;
};

const PupilJoinedCourseBanner: React.FC<BannerProps> = ({ courseStatus, seatsLeft }) => {
    const { t } = useTranslation();
    const { sizes } = useTheme();

    return (
        <Card bg="primary.100" maxWidth={sizes['smallWidth']}>
            <CourseTrafficLamp seatsLeft={seatsLeft} status={courseStatus} paddingY={3} />
            <Divider mb="3" />
            <Stack direction="row" alignItems="center">
                <Box pr="2">
                    <CheckIcon width={54} />
                </Box>
                <Text ml="1" fontSize="md">
                    {t('single.card.alreadyRegistered')}
                </Text>
            </Stack>
        </Card>
    );
};

export default PupilJoinedCourseBanner;
