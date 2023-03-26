import { Button, Modal, useTheme, VStack, Text } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StepperInput from '../components/StepperInput';

type Props = {
    increaseAmountOfParticipants: (participantsAmountToBeAdded: number) => void;
    maxParticipants: number;
};

const IncreaseMaxParticipantsModal: React.FC<Props> = ({ increaseAmountOfParticipants }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const [participantsAmountToBeAdded, setParticipantsAmountToBeAdded] = useState<number>(0);

    const increment = () => {
        setParticipantsAmountToBeAdded(participantsAmountToBeAdded + 1);
    };
    const decrement = () => {
        if (participantsAmountToBeAdded > 0) setParticipantsAmountToBeAdded(participantsAmountToBeAdded - 1);
    };

    return (
        <>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('single.joinPupilModal.header')}</Modal.Header>
                <Modal.Body>
                    <VStack space={space['1']} alignItems="left">
                        <Text>{t('single.joinPupilModal.amount')}</Text>
                        <StepperInput value={participantsAmountToBeAdded} increment={increment} decrement={decrement} />
                        <Button onPress={() => increaseAmountOfParticipants(participantsAmountToBeAdded)}>{t('single.joinPupilModal.add')}</Button>
                    </VStack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default IncreaseMaxParticipantsModal;
