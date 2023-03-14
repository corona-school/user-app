import { Button, Modal, useTheme, VStack } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StepperInput from '../components/StepperInput';

type Props = {
    increase: (newMaxParticipants: number) => void;
    maxParticipants: number;
};

const IncreaseMaxParticipantsModal: React.FC<Props> = ({ increase, maxParticipants }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const [newMaxParticipants, setNewMaxParticipants] = useState<number>(0);

    const increment = () => {
        setNewMaxParticipants(newMaxParticipants + 1);
    };
    const decrement = () => {
        if (newMaxParticipants > 0) setNewMaxParticipants(newMaxParticipants - 1);
    };

    const handleTextChange = (input: string) => {
        if (/^\d+$/.test(input)) {
            setNewMaxParticipants(parseInt(input));
        }
    };

    return (
        <>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('single.joinPupilModal.header')}</Modal.Header>
                <Modal.Body>
                    <VStack space={space['1']}>
                        <StepperInput value={newMaxParticipants} increment={increment} decrement={decrement} handleInputChange={handleTextChange} />
                        <Button onPress={() => increase(newMaxParticipants)}>{t('single.joinPupilModal.add')}</Button>
                    </VStack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default IncreaseMaxParticipantsModal;
