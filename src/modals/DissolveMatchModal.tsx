import { Button, Modal, Radio, Row, Text, useTheme, VStack } from 'native-base';
import { useMemo, useState } from 'react';
import { useUserType } from '../hooks/useApollo';
import { DEACTIVATE_PUPIL_MATCH_REQUESTS } from '../config';
import AlertMessage from '../widgets/AlertMessage';
import { useTranslation } from 'react-i18next';

type DissolveModalProps = {
    showDissolveModal: boolean | undefined;
    onPressDissolve: (dissolveReason: string) => any;
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

    const reasons = useMemo(() => (userType === 'student' && studentReasonOptions) || pupilReasonOptions, [userType]);

    return (
        <Modal isOpen={showDissolveModal} onClose={onPressBack}>
            <Modal.Content>
                <Modal.CloseButton />
                {currentIndex === 0 && (
                    <>
                        <Modal.Header>{t('matching.dissolve.modal.title')}</Modal.Header>
                        <Modal.Body>
                            <Radio.Group name="dissolve-reason" value={reason} onChange={setReason}>
                                <VStack space={space['1']}>
                                    {reasons.map((_: number, index: number) => (
                                        <Radio key={index} value={`${index + 1}`}>
                                            {t(`matching.dissolveReasons.${userType}.${index + 1}` as unknown as TemplateStringsArray)}
                                        </Radio>
                                    ))}
                                </VStack>
                            </Radio.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Row space={space['1']}>
                                <Button isDisabled={!reason} onPress={() => onPressDissolve(reason)}>
                                    {t('matching.dissolve.modal.btn')}
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
                        (DEACTIVATE_PUPIL_MATCH_REQUESTS === 'false' &&
                        <Modal.Header>{t('matching.dissolve.newMatch.title')}</Modal.Header>
                        <Modal.Body>
                            <Text>
                                {userType === 'student' ? t('matching.dissolve.newMatch.descriptionStudent') : t('matching.dissolve.newMatch.descriptionPupil')}
                            </Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Row space={space['1']}>
                                <Button onPress={onPressBack} variant="secondary">
                                    {t('cancel')}
                                </Button>
                                <Button
                                    isDisabled={!reason}
                                    onPress={() => {
                                        const res = onPressDissolve(reason);
                                        if (res) {
                                            setCurrentIndex(1);
                                        } else {
                                            onPressBack();
                                        }
                                    }}
                                >
                                    {userType === 'student'
                                        ? t('dashboard.helpers.buttons.requestMatchStudent')
                                        : t('dashboard.helpers.buttons.requestMatchPupil')}
                                </Button>
                            </Row>
                        </Modal.Footer>
                        ) (DEACTIVATE_PUPIL_MATCH_REQUESTS === 'true' &&
                        <AlertMessage content={t('lernfair.reason.matching.pupil.deactivated')} />)
                    </>
                )}
            </Modal.Content>
        </Modal>
    );
};

export default DissolveMatchModal;
