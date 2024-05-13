import { Button, FormControl, Modal, Row, Text, TextArea, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import DisableableButton from '../components/DisablebleButton';
import { useUserType } from '../hooks/useApollo';

type ReportMatchModalProps = {
    isOpen?: boolean;
    onClose: () => void;
    matchName?: string;
    matchId: number;
};

const ReportMatchModal = ({ onClose, isOpen, matchName, matchId }: ReportMatchModalProps) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const toast = useToast();
    const { isMobile } = useLayoutHelper();
    const [description, setDescription] = useState('');
    const userType = useUserType();

    const [reportMatch, { loading }] = useMutation(
        gql(`
        mutation ReportMatch($matchId: Int!, $description: String!) { 
	        matchReport(report: { matchId: $matchId, description: $description })
        }
    `)
    );

    useEffect(() => {
        if (isOpen) setDescription('');
    }, [isOpen]);

    const sendReportMessage = async () => {
        const response = await reportMatch({
            variables: {
                matchId,
                description: description,
            },
        });

        if (response.data?.matchReport) {
            toast.show({ description: t('matching.report.success'), placement: 'top' });
            onClose();
        } else {
            toast.show({ description: t('matching.report.failure') });
        }
    };

    const userShouldIncludeDescription = userType === 'student';

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content minW={isMobile ? '90vw' : 800}>
                <Modal.CloseButton />
                <Modal.Header>{t('matching.report.modal.title', { firstName: matchName })}</Modal.Header>
                <Modal.Body>
                    <Text paddingBottom={space['1']}>
                        {t(`matching.report.modal.${userType}.description` as unknown as TemplateStringsArray, { firstName: matchName })}
                    </Text>
                    <FormControl>
                        <Row flexDirection="column" paddingY={space['0.5']}>
                            <FormControl.Label>{t('matching.report.modal.problemDescription')}</FormControl.Label>
                            <TextArea value={description} onChangeText={setDescription} h={200} autoCompleteType={{}} />
                        </Row>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['2']}>
                        <Button variant="outline" onPress={onClose}>
                            {t('cancel')}
                        </Button>
                        <DisableableButton
                            isDisabled={loading || (userShouldIncludeDescription && !description)}
                            marginX="auto"
                            reasonDisabled={t('reasonsDisabled.fieldEmpty')}
                            onPress={sendReportMessage}
                        >
                            {t('matching.report.modal.submitButton')}
                        </DisableableButton>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

export default ReportMatchModal;
