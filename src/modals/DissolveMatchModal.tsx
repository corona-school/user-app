import { Button, Modal, Radio, Row, useTheme, VStack } from 'native-base';
import { useState } from 'react';
import { useUserType } from '../hooks/useApollo';
import { useTranslation } from 'react-i18next';
import { Dissolve_Reason } from '../gql/graphql';

type DissolveModalProps = {
    showDissolveModal: boolean | undefined;
    alsoShowWarningModal?: boolean | undefined;
    onPressDissolve: (dissolveReason: Dissolve_Reason) => any;
    onPressBack: () => any;
};

const DissolveMatchModal: React.FC<DissolveModalProps> = ({ showDissolveModal, alsoShowWarningModal, onPressDissolve, onPressBack }) => {
    const [showedWarning, setShowedWarning] = useState<boolean>(false);
    const { t } = useTranslation();
    const { space } = useTheme();
    const userType = useUserType();
    const [reason, setReason] = useState<Dissolve_Reason>();
    const reasons = [
        Dissolve_Reason.Ghosted,
        Dissolve_Reason.NoMoreHelpNeeded,
        Dissolve_Reason.IsOfNoHelp,
        Dissolve_Reason.NoMoreTime,
        Dissolve_Reason.PersonalIssues,
        Dissolve_Reason.ScheduleIssues,
        Dissolve_Reason.TechnicalIssues,
        Dissolve_Reason.LanguageIssues,
        Dissolve_Reason.Other,
    ];

    return (
        <Modal isOpen={showDissolveModal} onClose={onPressBack}>
            <Modal.Content>
                <Modal.CloseButton />
                {alsoShowWarningModal && !showedWarning ? (
                    <>
                        <Modal.Header>{t('matching.dissolve.warningModal.title')}</Modal.Header>
                        <Modal.Body>{t('matching.dissolve.warningModal.body')}</Modal.Body>
                        <Modal.Footer>
                            <Row space={space['1']}>
                                <Button onPress={onPressBack} variant="ghost">
                                    {t('back')}
                                </Button>
                                <Button onPress={() => setShowedWarning(true)}>{t('matching.dissolve.warningModal.btn')}</Button>
                            </Row>
                        </Modal.Footer>
                    </>
                ) : (
                    <>
                        <Modal.Header>{t('matching.dissolve.modal.title')}</Modal.Header>
                        <Modal.Body>
                            <Radio.Group name="dissolve-reason" value={reason} onChange={(key) => setReason(key as Dissolve_Reason)}>
                                <VStack space={space['1']}>
                                    {reasons.map((key) => (
                                        <Radio key={key} value={key}>
                                            {t(`matching.dissolveReasons.${userType}.${key}` as unknown as TemplateStringsArray)}
                                        </Radio>
                                    ))}
                                </VStack>
                            </Radio.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Row space={space['1']}>
                                <Button isDisabled={!reason} onPress={() => onPressDissolve(reason ?? Dissolve_Reason.Unknown)}>
                                    {t('matching.dissolve.modal.btn')}
                                </Button>
                                <Button onPress={onPressBack} variant="ghost">
                                    {t('back')}
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
