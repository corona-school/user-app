import { ApolloQueryResult, useMutation } from '@apollo/client';
import { gql } from '../../gql';
import { Box, Button, Column, Heading, Modal, Row, Spacer, Text, useBreakpointValue, useTheme, useToast } from 'native-base';
import { getSchoolTypeKey } from '../../types/lernfair/SchoolType';
import AddCircleIcon from '../../assets/icons/ic_add_circle.svg';
import { useCallback, useState } from 'react';
import { LFPupilOnWaitinglist, PupilOnWaitinglist } from '../../types/lernfair/Course';
import { useTranslation } from 'react-i18next';
import AddPupilModal from '../../modals/AddPupilModal';
import IncreaseMaxParticipantsModal from '../../modals/IncreaseMaxParticipantsModal';
import AlertMessage from '../../widgets/AlertMessage';
import { GetSingleSubcourseQuery } from '../../gql/graphql';

type WaitingListProps = {
    subcourseId: number;
    pupilsOnWaitinglist: LFPupilOnWaitinglist;
    maxParticipants: number;
    refetch: () => Promise<ApolloQueryResult<GetSingleSubcourseQuery>>;
};

const Waitinglist: React.FC<WaitingListProps> = ({ subcourseId, pupilsOnWaitinglist, maxParticipants, refetch }) => {
    const [isJoinPupilModalOpen, setIsJoinPupilModalOpen] = useState(false);
    const [isIncreaseMaxParticipantsModalOpen, setIsIncreaseMaxParticipantsModalOpen] = useState(false);
    const [pupilToAdd, setPupilToAdd] = useState<PupilOnWaitinglist>();

    const { space } = useTheme();
    const toast = useToast();
    const { t } = useTranslation();
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const [addPupilFromWaitinglist, { error }] = useMutation(
        gql(`mutation JoinFromWaitinglist($subcourseId: Float!, $pupilId: Float!) { 
            subcourseJoinFromWaitinglist(subcourseId: $subcourseId, pupilId: $pupilId) 
        }`)
    );

    const [increaseMaxParticipants] = useMutation(
        gql(`mutation IncreaseMaxParticipants($maxParticipants: Int!, $subcourseId: Float!) {
            subcourseEdit (
                subcourse: { maxParticipants: $maxParticipants}
                subcourseId: $subcourseId
            ) {
              maxParticipants
            }
          }`)
    );

    const handleOpenModal = (pupilOnWaitinglist: PupilOnWaitinglist) => {
        setIsJoinPupilModalOpen(true);
        setPupilToAdd(pupilOnWaitinglist);
    };

    const handleAddPupil = useCallback(
        async (pupilId: number) => {
            // await addPupilFromWaitinglist({ variables: { subcourseId: subcourseId, pupilId: pupilId } });
            // if (error) {
            //     console.error(error);
            //     toast.show({ description: t('single.waitinglist.error'), placement: 'top' });
            // }
            // setIsJoinPupilModalOpen(false);
            // toast.show({ description: t('single.waitinglist.toast'), placement: 'top' });
            // refetch();

            try {
                await addPupilFromWaitinglist({ variables: { subcourseId: subcourseId, pupilId: pupilId } });
                setIsJoinPupilModalOpen(false);
                toast.show({ description: t('single.waitinglist.toast'), placement: 'top' });
                refetch();
            } catch (error) {
                console.error(error);
                toast.show({ description: t('single.waitinglist.error'), placement: 'top' });
            }
        },
        [addPupilFromWaitinglist, refetch, subcourseId]
    );

    const handleIncreaseAmount = useCallback(
        async (participantsAmountToBeAdded: number) => {
            setIsIncreaseMaxParticipantsModalOpen(false);
            await increaseMaxParticipants({ variables: { maxParticipants: maxParticipants + participantsAmountToBeAdded, subcourseId: subcourseId } });
            toast.show({ description: t('single.joinPupilModal.success'), placement: 'top' });
            refetch();
        },
        [increaseMaxParticipants, maxParticipants, refetch, subcourseId]
    );

    return (
        <>
            <Box width={isMobile ? 'full' : '350'}>
                {pupilsOnWaitinglist && pupilsOnWaitinglist?.length > 0 ? (
                    <Button onPress={() => setIsIncreaseMaxParticipantsModalOpen(true)} mb={space['1']}>
                        {t('single.joinPupilModal.header')}
                    </Button>
                ) : (
                    <AlertMessage content={t('single.waitinglist.noPupilsOnWaitinglist')} />
                )}
                {pupilsOnWaitinglist?.map((pupil) => {
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
                            <Column>
                                <Button variant="outline" onPress={() => handleOpenModal(pupil)}>
                                    <AddCircleIcon />
                                </Button>
                            </Column>
                        </Row>
                    );
                })}
            </Box>
            <Modal isOpen={isJoinPupilModalOpen} onClose={() => setIsJoinPupilModalOpen(false)} w="full">
                <AddPupilModal pupil={pupilToAdd} addPupilToCourse={handleAddPupil} />
            </Modal>
            <Modal isOpen={isIncreaseMaxParticipantsModalOpen} onClose={() => setIsIncreaseMaxParticipantsModalOpen(false)} w="full">
                <IncreaseMaxParticipantsModal increaseAmountOfParticipants={handleIncreaseAmount} maxParticipants={maxParticipants} />
            </Modal>
        </>
    );
};

export default Waitinglist;
