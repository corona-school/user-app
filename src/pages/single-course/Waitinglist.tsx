import { useMutation } from '@apollo/client';
import { gql } from '../../gql';
import { Box, Button, Column, Heading, Modal, Row, Spacer, Stack, Text, useBreakpointValue, useTheme, useToast } from 'native-base';
import { getSchoolTypeKey } from '../../types/lernfair/SchoolType';
import AddCircleIcon from '../../assets/icons/ic_add_circle.svg';
import { useCallback, useState } from 'react';
import { LFPupilOnWaitinglist, PupilOnWaitinglist } from '../../types/lernfair/Course';
import { useTranslation } from 'react-i18next';
import JoinPupilModal from '../../modals/JoinPupilModal';

type WaitingListProps = {
    subcourseId: number;
    pupils: LFPupilOnWaitinglist;
    refetch: () => any;
};

const Waitinglist: React.FC<WaitingListProps> = ({ subcourseId, pupils, refetch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pupilToJoin, setPupilToJoin] = useState<PupilOnWaitinglist>();

    const { space } = useTheme();
    const toast = useToast();
    const { t } = useTranslation();
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const [joinFromWaitinglist] = useMutation(
        gql(`mutation JoinFromWaitinglist($subcourseId: Float!, $pupilId: Float!) { 
            subcourseJoinFromWaitinglist(subcourseId: $subcourseId, pupilId: $pupilId) 
        }`)
    );

    const handleOpenModal = (pupilOnWaitinglist: PupilOnWaitinglist) => {
        setIsModalOpen(true);
        setPupilToJoin(pupilOnWaitinglist);
    };

    const handleJoinPupil = useCallback(
        async (pupilId: number) => {
            await joinFromWaitinglist({ variables: { subcourseId: subcourseId, pupilId: pupilId } });
            setIsModalOpen(false);
            toast.show({ description: t('single.waitinglist.toast'), placement: 'top' });
            refetch();
        },
        [joinFromWaitinglist, refetch, subcourseId, toast]
    );

    return (
        <>
            <Box width={isMobile ? 'full' : '350'}>
                {pupils?.map((pupil) => {
                    return (
                        <Row marginBottom={space['1.5']} alignItems="center">
                            <Column>
                                <Heading fontSize="md">
                                    {pupil.firstname} {pupil.lastname}
                                </Heading>
                                <Text>
                                    {pupil.schooltype && `${getSchoolTypeKey(pupil.schooltype)}, `}
                                    {pupil.grade}
                                </Text>
                            </Column>
                            <Spacer />
                            <Column marginRight={space['1']}>
                                <Button variant="outline" onPress={() => handleOpenModal(pupil)}>
                                    <AddCircleIcon />
                                </Button>
                            </Column>
                        </Row>
                    );
                })}
            </Box>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <JoinPupilModal pupil={pupilToJoin} joinPupilToCourse={handleJoinPupil} />
            </Modal>
        </>
    );
};

export default Waitinglist;
