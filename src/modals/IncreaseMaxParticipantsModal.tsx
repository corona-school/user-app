import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import StepperInput from '../components/StepperInput';

interface IncreaseMaxParticipantsModalProps extends BaseModalProps {
    subcourseId: number;
    onParticipantsIncreased: () => Promise<void>;
    maxParticipants: number;
}

const INCREASE_MAX_PARTICIPANTS_MUTATION = gql(`mutation IncreaseMaxParticipants($maxParticipants: Int!, $subcourseId: Float!) {
    subcourseEdit (
        subcourse: { maxParticipants: $maxParticipants}
        subcourseId: $subcourseId
    ) {
      maxParticipants
    }
  }`);

const IncreaseMaxParticipantsModal = ({ isOpen, onOpenChange, subcourseId, onParticipantsIncreased, maxParticipants }: IncreaseMaxParticipantsModalProps) => {
    const { t } = useTranslation();
    const [participantsAmountToBeAdded, setParticipantsAmountToBeAdded] = useState<number>(0);
    const [increaseMaxParticipants, { loading: isIncreasing }] = useMutation(INCREASE_MAX_PARTICIPANTS_MUTATION);

    const increment = () => {
        setParticipantsAmountToBeAdded(participantsAmountToBeAdded + 1);
    };
    const decrement = () => {
        if (participantsAmountToBeAdded > 0) setParticipantsAmountToBeAdded(participantsAmountToBeAdded - 1);
    };

    const handleOnIncreaseAmount = async () => {
        try {
            await increaseMaxParticipants({ variables: { maxParticipants: maxParticipants + participantsAmountToBeAdded, subcourseId: subcourseId } });
            toast.success(t('single.joinPupilModal.success'));
            if (onParticipantsIncreased) await onParticipantsIncreased();
        } catch (error) {
            toast.error(t('single.joinPupilModal.error'));
        } finally {
            onOpenChange(false);
        }
    };

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('single.joinPupilModal.header')}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-2">
                <Typography>{t('single.joinPupilModal.amount')}</Typography>
                <StepperInput value={participantsAmountToBeAdded} increment={increment} decrement={decrement} />
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" onClick={handleOnIncreaseAmount} isLoading={isIncreasing}>
                    {t('single.joinPupilModal.add')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default IncreaseMaxParticipantsModal;
