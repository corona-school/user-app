import { Box, Button, Card, Column, Divider, Modal, Row, Spacer, Stack, Text, useBreakpointValue, useTheme, VStack } from 'native-base';
import CourseTrafficLamp from './CourseTrafficLamp';
import SandClock from '../assets/icons/lernfair/Icon_SandClock.svg';
import { useTranslation } from 'react-i18next';
import { TrafficStatus } from '../types/lernfair/Course';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';

type BannerProps = {
    courseStatus: TrafficStatus;
    subcourseId: number;
    onWaitinglist: boolean;
    refresh: () => void;
};

const WaitinglistBanner: React.FC<BannerProps> = ({ courseStatus, subcourseId, onWaitinglist, refresh }) => {
    const [isLeaveWaitingListModal, setLeaveWaitingListModal] = useState(false);

    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const [leaveWaitingList, { loading, data }] = useMutation(
        gql(`
            mutation LeaveWaitingList($subcourseId: Float!) {
                subcourseLeaveWaitinglist(subcourseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourseId },
        }
    );

    useEffect(() => {
        if (data?.subcourseLeaveWaitinglist) {
            setLeaveWaitingListModal(true);
        }
    }, [data?.subcourseLeaveWaitinglist]);

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
                                onPress={() => {
                                    leaveWaitingList();
                                }}
                                width={ButtonContainer}
                                marginBottom={space['0.5']}
                                isDisabled={loading}
                            >
                                {t('single.waitinglist.leaveWaitinglist')}
                            </Button>
                        </Stack>
                    </Card>
                </Box>
            }
            <Modal
                isOpen={isLeaveWaitingListModal}
                onClose={() => {
                    setLeaveWaitingListModal(false);
                    refresh();
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}> {t('single.waitinglist.leaveSuccess')}</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setLeaveWaitingListModal(false);
                                        refresh();
                                    }}
                                >
                                    {t('single.global.close')}
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default WaitinglistBanner;
