import { Box, Button, Card, Divider, Spacer, Stack, Text, useBreakpointValue, useTheme, VStack } from 'native-base';
import CourseTrafficLamp from './CourseTrafficLamp';
import SandClock from '../assets/icons/lernfair/Icon_SandClock.svg';
import { useTranslation } from 'react-i18next';
import { TrafficStatus } from '../types/lernfair/Course';
import { Dispatch, SetStateAction } from 'react';

type BannerProps = {
    courseStatus: TrafficStatus;
    loading: boolean;
    onLeaveWaitinglist: Dispatch<SetStateAction<boolean>>;
};

const WaitinglistBanner: React.FC<BannerProps> = ({ courseStatus, loading, onLeaveWaitinglist }) => {
    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    return (
        <>
            {
                <Box>
                    <Card bg="primary.100" maxWidth={sizes['imageHeaderWidth']}>
                        <CourseTrafficLamp status={courseStatus} paddingY={3} />
                        <Divider mb="3" />
                        <Stack direction={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} space={1}>
                            <Stack direction="row" alignItems="center" mb="2">
                                <Box pr="2">
                                    <SandClock />
                                </Box>
                                {isMobile && <Spacer />}
                                <VStack maxW={200}>
                                    <Text fontSize="md" numberOfLines={2}>
                                        {t('single.waitinglist.joinMember')}
                                    </Text>
                                </VStack>
                            </Stack>
                            <Spacer />
                            <Button
                                onPress={() => onLeaveWaitinglist(true)}
                                width={ButtonContainer}
                                marginBottom={space['0.5']}
                                variant="outline"
                                isDisabled={loading}
                            >
                                {t('single.waitinglist.leaveWaitinglist')}
                            </Button>
                        </Stack>
                    </Card>
                </Box>
            }
        </>
    );
};

export default WaitinglistBanner;
