import { useMutation } from '@apollo/client';
import { gql } from '../../gql';
import { Box, Button, Column, Heading, Row, Spacer, Text, useBreakpointValue, useTheme, useToast } from 'native-base';
import { getSchoolTypeKey } from '../../types/lernfair/SchoolType';
import AddCircleIcon from '../../assets/icons/ic_add_circle.svg';
import { useCallback } from 'react';
import { LFPupilOnWaitinglist } from '../../types/lernfair/Course';
import { useTranslation } from 'react-i18next';

type WaitingListProps = {
    subcourseId: number;
    pupils: LFPupilOnWaitinglist;
    refetch: () => any;
};

const Waitinglist: React.FC<WaitingListProps> = ({ subcourseId, pupils, refetch }) => {
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

    const handleJoinPupil = useCallback(
        async (pupilId: number) => {
            await joinFromWaitinglist({ variables: { subcourseId: subcourseId, pupilId: pupilId } });
            toast.show({ description: t('single.waitinglist.toast'), placement: 'top' });
            refetch();
        },
        [joinFromWaitinglist, refetch, subcourseId, toast]
    );

    return (
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
                            <Button variant="outline" onPress={() => handleJoinPupil(pupil.id)}>
                                <AddCircleIcon />
                            </Button>
                        </Column>
                    </Row>
                );
            })}
        </Box>
    );
};

export default Waitinglist;
