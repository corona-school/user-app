import { ApolloQueryResult } from '@apollo/client';
import { useCallback, useState } from 'react';
import { LFPupilsOnWaitinglist, PupilOnWaitinglist } from '@/types/lernfair/Course';
import { useTranslation } from 'react-i18next';
import AddPupilModal from '@/modals/AddPupilModal';
import IncreaseMaxParticipantsModal from '@/modals/IncreaseMaxParticipantsModal';
import ParticipantRow from '../subcourse/ParticipantRow';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { IconCircleCheckFilled, IconInfoCircleFilled } from '@tabler/icons-react';

type WaitingListProps = {
    subcourseId: number;
    pupils: LFPupilsOnWaitinglist;
    maxParticipants: number;
    refetch: () => Promise<ApolloQueryResult<any>>;
    type: 'waitinglist' | 'prospectlist';
};

const WaitingListProspectList: React.FC<WaitingListProps> = ({ subcourseId, pupils, maxParticipants, refetch, type }) => {
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
                    {pupils && pupils?.length > 0 ? (
                        type === 'waitinglist' ? (
                            <Button className="w-fit" onClick={() => setIsIncreaseMaxParticipantsModalOpen(true)}>
                                {t('single.joinPupilModal.header')}
                            </Button>
                        ) : (
                            <Alert className="w-full lg:w-fit mt-4" icon={<IconInfoCircleFilled />}>
                                {t('single.prospectList.description')}
                            </Alert>
                        )
                    ) : (
                        <Alert className="w-full lg:w-fit mt-4" icon={<IconCircleCheckFilled />}>
                            {type === 'waitinglist' ? t('single.waitinglist.noPupilsOnWaitinglist') : t('single.prospectList.noProspects')}
                        </Alert>
                    )}
                </div>
                <div className="flex flex-col gap-y-6 max-w-[980px]">
                    {pupils?.map((pupil) => {
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
            </div>
            <AddPupilModal
                pupil={pupilToAdd}
                isOpen={isJoinPupilModalOpen}
                onOpenChange={setIsJoinPupilModalOpen}
                subcourseId={subcourseId}
                onPupilAdded={handleOnFinish}
                type={type}
            />
            {type === 'waitinglist' && (
                <IncreaseMaxParticipantsModal
                    isOpen={isIncreaseMaxParticipantsModalOpen}
                    onOpenChange={setIsIncreaseMaxParticipantsModalOpen}
                    onParticipantsIncreased={handleOnFinish}
                    maxParticipants={maxParticipants}
                    subcourseId={subcourseId}
                />
            )}
        </>
    );
};

export default WaitingListProspectList;
