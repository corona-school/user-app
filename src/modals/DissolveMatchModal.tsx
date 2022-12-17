import { Button, Modal, Radio, Row, Text, useTheme, VStack } from 'native-base';
import { useMemo, useState } from 'react';
import { useUserType } from '../hooks/useApollo';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

type DissolveModalProps = {
    showDissolveModal: boolean | undefined;
    onPressDissolve: (dissolveReason: string) => Promise<void>;
    onPressBack: () => any;
};

// corresponding dissolve reason ids in translation file
// for now just loop through 1-9 (+1 in loop)
export const studentReasonOptions = new Array(9).fill(0);
export const pupilReasonOptions = new Array(9).fill(0);

const DissolveMatchModal: React.FC<DissolveModalProps> = ({ showDissolveModal, onPressDissolve, onPressBack }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const { t } = useTranslation();
    const { space } = useTheme();
    const userType = useUserType();
    const [reason, setReason] = useState<string>('');
    const navigate = useNavigate();

    const reasons = useMemo(() => (userType === 'student' && studentReasonOptions) || pupilReasonOptions, [userType]);

    return (
        <Modal isOpen={showDissolveModal} onClose={onPressBack}>
            <Modal.Content>
                <Modal.CloseButton />
                {currentIndex === 0 && (
                    <>
                        <Modal.Header>{t('matching.dissolveModal.title')}</Modal.Header>
                        <Modal.Body>
                            <Radio.Group name="dissolve-reason" value={reason} onChange={setReason}>
                                <VStack space={space['1']}>
                                    {reasons.map((_: number, index: number) => (
                                        <Radio value={`${index + 1}`}>{t(`matching.dissolveReasons.${userType}.${index + 1}`)}</Radio>
                                    ))}
                                </VStack>
                            </Radio.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Row space={space['1']}>
                                <Button isDisabled={!reason} onPress={() => setCurrentIndex(1)}>
                                    {t('matching.dissolveModal.btn')}
                                </Button>
                                <Button onPress={onPressBack} variant="ghost">
                                    {t('back')}
                                </Button>
                            </Row>
                        </Modal.Footer>
                    </>
                )}
                {currentIndex === 1 && (
                    <>
                        <Modal.Header>Neue Lernpartner:in anfordern</Modal.Header>
                        <Modal.Body>
                            <Text>
                                Möchest du mit einem:r neuen Lernpartner:in verbunden werden? Beachte dabei, dass du wieder einige Zeit warten musst bis wir
                                jemanden für dich finden können.
                            </Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Row space={space['1']}>
                                <Button
                                    onPress={() => {
                                        onPressDissolve(reason);
                                    }}
                                    variant="secondary"
                                >
                                    Abbrechen
                                </Button>
                                <Button
                                    isDisabled={!reason}
                                    onPress={() => {
                                        onPressDissolve(reason).then(() => navigate('/request-match'));
                                    }}
                                >
                                    Neue Lernpartner:in
                                </Button>
                            </Row>
                        </Modal.Footer>
                    </>
                )}
            </Modal.Content>
        </Modal>
    );
};

export default DissolveMatchModal;
