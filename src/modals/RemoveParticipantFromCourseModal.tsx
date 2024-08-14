import { useTranslation } from 'react-i18next';
import { SubcourseParticipant } from '../types/lernfair/Course';
import { getSchoolTypeKey } from '../types/lernfair/SchoolType';
import { getGradeLabel } from '../Utility';
import { type BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/atoms/Modal';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

interface RemoveParticipantFromCourseModalProps extends BaseModalProps {
    subcourseId: number;
    participant: SubcourseParticipant;
    onParticipantRemoved: () => Promise<void>;
}

const REMOVE_PARTICIPANT_MUTATION = gql(`
    mutation removeParticipantFromCourse($subcourseId: Float!, $pupilId: Float!) {
        subcourseLeave(subcourseId: $subcourseId, pupilId: $pupilId)
    }
`);

const RemoveParticipantFromCourseModal = ({ isOpen, onOpenChange, subcourseId, participant, onParticipantRemoved }: RemoveParticipantFromCourseModalProps) => {
    const { t } = useTranslation();
    const [removeParticipant, { loading: isRemoving }] = useMutation(REMOVE_PARTICIPANT_MUTATION);

    const handleOnRemoveParticipant = async () => {
        try {
            await removeParticipant({ variables: { subcourseId, pupilId: participant.id } });
            toast.success(t('single.removeParticipantFromCourseModal.success'));
            if (onParticipantRemoved) await onParticipantRemoved();
        } catch (error) {
            toast.error(t('single.removeParticipantFromCourseModal.error'));
        } finally {
            onOpenChange(false);
        }
    };

    return (
        <>
            <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
                <ModalHeader>
                    <ModalTitle>{t('single.removeParticipantFromCourseModal.header')}</ModalTitle>
                </ModalHeader>
                {participant && (
                    <div className="flex flex-col py-4">
                        <Typography>
                            <Typography as="span" className="block font-bold">
                                {participant.firstname} {participant.lastname}
                            </Typography>
                            {participant.schooltype && `${getSchoolTypeKey(participant.schooltype)}, `}
                            {getGradeLabel(participant.gradeAsInt)}
                        </Typography>
                    </div>
                )}
                <ModalFooter>
                    <div className="flex flex-row gap-4">
                        <Button variant="destructive" isLoading={isRemoving} onClick={handleOnRemoveParticipant}>
                            {t('single.removeParticipantFromCourseModal.remove')}
                        </Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            {t('cancel')}
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default RemoveParticipantFromCourseModal;
