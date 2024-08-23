import { ApolloQueryResult } from '@apollo/client';
import { useCallback, useState } from 'react';
import { LFPupilsOnWaitinglist, PupilOnWaitinglist } from '@/types/lernfair/Course';
import { useTranslation } from 'react-i18next';
import AddPupilModal from '@/modals/AddPupilModal';
import IncreaseMaxParticipantsModal from '@/modals/IncreaseMaxParticipantsModal';
import ParticipantRow from '../subcourse/ParticipantRow';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { IconCircleCheckFilled } from '@tabler/icons-react';

type WaitingListProps = {
    subcourseId: number;
    pupilsOnWaitinglist: LFPupilsOnWaitinglist;
    maxParticipants: number;
    refetch: () => Promise<ApolloQueryResult<any>>;
};

const Waitinglist: React.FC<WaitingListProps> = ({ subcourseId, pupilsOnWaitinglist, maxParticipants, refetch }) => {
    const [isJoinPupilModalOpen, setIsJoinPupilModalOpen] = useState(false);
    const [isIncreaseMaxParticipantsModalOpen, setIsIncreaseMaxParticipantsModalOpen] = useState(false);
    const [pupilToAdd, setPupilToAdd] = useState<PupilOnWaitinglist>();

    const { t } = useTranslation();

    const handleOpenModal = (pupilOnWaitinglist: PupilOnWaitinglist) => {
        setIsJoinPupilModalOpen(true);
        setPupilToAdd(pupilOnWaitinglist);
    };

    const handleOnFinish = useCallback(async () => {
        refetch();
    }, [refetch]);

    return (
        <>
            <div className="w-full">
                <div className="mb-2">
                    {pupilsOnWaitinglist && pupilsOnWaitinglist?.length > 0 ? (
                        <Button className="w-fit" onClick={() => setIsIncreaseMaxParticipantsModalOpen(true)}>
                            {t('single.joinPupilModal.header')}
                        </Button>
                    ) : (
                        <Alert className="w-full lg:w-fit mt-4" icon={<IconCircleCheckFilled />}>
                            {t('single.waitinglist.noPupilsOnWaitinglist')}
                        </Alert>
                    )}
                </div>
                {pupilsOnWaitinglist?.map((pupil) => {
                    return (
                        <ParticipantRow
                            key={pupil.id}
                            participant={{
                                firstname: pupil.firstname!,
                                lastname: pupil.lastname!,
                                grade: pupil.grade!,
                                gradeAsInt: pupil.gradeAsInt,
                                id: pupil.id,
                                schooltype: pupil.schooltype!,
                            }}
                            isInstructor
                            addParticipant={(participant) =>
                                handleOpenModal({
                                    id: participant.id,
                                    firstname: participant.firstname,
                                    lastname: participant.lastname!,
                                    gradeAsInt: participant.gradeAsInt,
                                    grade: participant.grade,
                                    schooltype: participant.schooltype!,
                                })
                            }
                        />
                    );
                })}
            </div>
            <AddPupilModal
                pupil={pupilToAdd}
                isOpen={isJoinPupilModalOpen}
                onOpenChange={setIsJoinPupilModalOpen}
                subcourseId={subcourseId}
                onPupilAdded={handleOnFinish}
            />
            <IncreaseMaxParticipantsModal
                isOpen={isIncreaseMaxParticipantsModalOpen}
                onOpenChange={setIsIncreaseMaxParticipantsModalOpen}
                onParticipantsIncreased={handleOnFinish}
                maxParticipants={maxParticipants}
                subcourseId={subcourseId}
            />
        </>
    );
};

export default Waitinglist;
