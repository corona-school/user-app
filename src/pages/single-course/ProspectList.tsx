import { ApolloQueryResult } from '@apollo/client';
import { useCallback, useState } from 'react';
import { PupilOnWaitinglist } from '@/types/lernfair/Course';
import { useTranslation } from 'react-i18next';
import AddPupilModal from '@/modals/AddPupilModal';
import ParticipantRow from '../subcourse/ParticipantRow';
import { Alert } from '@/components/Alert';
import { IconCircleCheckFilled, IconInfoCircleFilled } from '@tabler/icons-react';

type ProspectListProps = {
    subcourseId: number;
    prospects: PupilOnWaitinglist[];
    refetch: () => Promise<ApolloQueryResult<any>>;
};

const ProspectList: React.FC<ProspectListProps> = ({ subcourseId, prospects, refetch }) => {
    const [isJoinPupilModalOpen, setIsJoinPupilModalOpen] = useState(false);
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
                    {prospects.length === 0 ? (
                        <Alert className="w-full lg:w-fit mt-4" icon={<IconCircleCheckFilled />}>
                            {t('single.prospectList.noProspects')}
                        </Alert>
                    ) : (
                        <Alert className="w-full lg:w-fit mt-4" icon={<IconInfoCircleFilled />}>
                            {t('single.prospectList.description')}
                        </Alert>
                    )}
                </div>
                <div className="flex flex-col gap-y-6 max-w-[980px]">
                    {prospects.map((pupil) => {
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
                type="prospectlist"
            />
        </>
    );
};

export default ProspectList;
