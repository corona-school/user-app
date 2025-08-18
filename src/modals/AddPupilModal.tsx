import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PupilOnWaitinglist } from '../types/lernfair/Course';
import { getSchoolTypeKey } from '../types/lernfair/SchoolType';
import { getGradeLabel } from '../Utility';

interface AddPupilModalProps extends BaseModalProps {
    subcourseId: number;
    pupil?: PupilOnWaitinglist;
    onPupilAdded: () => Promise<void>;
    type: 'waitinglist' | 'prospectlist';
}

const ADD_PUPIL_FROM_WAITING_LIST_MUTATION = gql(`mutation JoinFromWaitinglist($subcourseId: Float!, $pupilId: Float!) { 
    subcourseJoinFromWaitinglist(subcourseId: $subcourseId, pupilId: $pupilId) 
}`);

const ADD_PUPIL_FROM_PROSPECT_LIST_MUTATION = gql(`mutation JoinFromProspectList($subcourseId: Float!, $pupilId: Float!) {
    subcourseJoinFromProspects(subcourseId: $subcourseId, pupilId: $pupilId) 
}`);

const AddPupilModal = ({ isOpen, onOpenChange, subcourseId, pupil, onPupilAdded, type }: AddPupilModalProps) => {
    const { t } = useTranslation();
    const [addPupil, { loading: isAdding }] = useMutation(
        type === 'waitinglist' ? ADD_PUPIL_FROM_WAITING_LIST_MUTATION : ADD_PUPIL_FROM_PROSPECT_LIST_MUTATION
    );

    const handleOnAddPupil = async () => {
        if (!pupil) return;
        try {
            await addPupil({ variables: { subcourseId, pupilId: pupil.id } });
            toast.success(t(type === 'waitinglist' ? 'single.waitinglist.toast' : 'single.prospectList.toast'));
            if (onPupilAdded) await onPupilAdded();
        } catch (error) {
            toast.error(t(type === 'waitinglist' ? 'single.waitinglist.error' : 'single.prospectList.error'));
        } finally {
            onOpenChange(false);
        }
    };

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('single.joinPupilModal.header')}</ModalTitle>
            </ModalHeader>
            {pupil && (
                <div className="flex flex-col py-4">
                    <Typography>
                        <Typography as="span" className="block font-bold">
                            {pupil.firstname} {pupil.lastname}
                        </Typography>
                        {pupil.schooltype && `${getSchoolTypeKey(pupil.schooltype)}, `}
                        {pupil.gradeAsInt && getGradeLabel(pupil.gradeAsInt)}
                    </Typography>
                </div>
            )}
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" isLoading={isAdding} onClick={handleOnAddPupil}>
                    {t('single.joinPupilModal.add')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddPupilModal;
