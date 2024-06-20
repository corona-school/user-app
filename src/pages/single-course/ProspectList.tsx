import { Box, Button, Column, Heading, Modal, Row, Spacer, useBreakpointValue, useTheme, useToast } from 'native-base';
import AddCircleIcon from '../../assets/icons/ic_add_circle.svg';
import AddPupilModal from '../../modals/AddPupilModal';
import { useCallback, useState } from 'react';
import { SparseParticipant } from '../../gql/graphql';
import { ApolloQueryResult, useMutation } from '@apollo/client';
import { gql } from '../../gql';
import { useTranslation } from 'react-i18next';

type ProspectListProps = {
    subcourseId: number;
    prospects: SparseParticipant[];
    refetch: () => Promise<ApolloQueryResult<any>>;
};
const ProspectList: React.FC<ProspectListProps> = ({ prospects, subcourseId, refetch }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const [isFetching, setFetching] = useState(false);
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const [isJoinPupilModalOpen, setIsJoinPupilModalOpen] = useState(false);
    const [pupilToAdd, setPupilToAdd] = useState<undefined | SparseParticipant>();

    const [addProspect] = useMutation(
        gql(`mutation JoinProspect($subcourseId: Float!, $pupilId: Float!) { 
            subcourseJoinFromProspects(subcourseId: $subcourseId, pupilId: $pupilId) 
        }`)
    );

    const handleOpenModal = (prospect: SparseParticipant) => {
        setIsJoinPupilModalOpen(true);
        setPupilToAdd(prospect);
    };

    const handleAddPupil = useCallback(
        async (pupilId: number) => {
            try {
                setFetching(true);
                await addProspect({ variables: { subcourseId: subcourseId, pupilId: pupilId } });
                setIsJoinPupilModalOpen(false);
                toast.show({ description: t('single.waitinglist.toast'), placement: 'top' });
                await refetch();
            } catch (error) {
                toast.show({ description: t('single.waitinglist.error'), placement: 'top' });
            } finally {
                setFetching(false);
            }
        },
        [addProspect, refetch, subcourseId]
    );
    return (
        <>
            {prospects?.map((pupil) => {
                return (
                    <>
                        <Box width={isMobile ? 'full' : '350'}>
                            <Row marginBottom={space['1.5']} alignItems="center">
                                <Column>
                                    <Heading fontSize="md">
                                        {pupil.firstname} {pupil.lastname}
                                    </Heading>
                                </Column>
                                <Spacer />
                                <Column>
                                    <Button variant="outline" onPress={() => handleOpenModal(pupil)} disabled={isFetching}>
                                        <AddCircleIcon />
                                    </Button>
                                </Column>
                            </Row>
                            <Modal isOpen={isJoinPupilModalOpen} onClose={() => setIsJoinPupilModalOpen(false)} w="full">
                                <AddPupilModal pupil={{ ...pupilToAdd!, schooltype: undefined, gradeAsInt: undefined }} addPupilToCourse={handleAddPupil} />
                            </Modal>
                        </Box>
                    </>
                );
            })}
        </>
    );
};

export default ProspectList;
