import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import { useUserType } from '../hooks/useApollo';
import { toast } from 'sonner';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { asTranslationKey } from '@/helper/string-helper';
import { Label } from '@/components/Label';
import { TextArea } from '@/components/TextArea';

interface ReportMatchModalProps extends BaseModalProps {
    matchName?: string;
    matchId: number;
}

const ReportMatchModal = ({ onOpenChange, isOpen, matchName, matchId }: ReportMatchModalProps) => {
    const { t } = useTranslation();
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
            toast.success(t('matching.report.success'));
            onOpenChange(false);
        } else {
            toast.error(t('matching.report.failure'));
        }
    };

    const userShouldIncludeDescription = userType === 'student';

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('matching.report.modal.title', { firstName: matchName })}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <Typography>{t(asTranslationKey(`matching.report.modal.${userType}.description`), { firstName: matchName })}</Typography>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="description">{t('matching.report.modal.problemDescription')}</Label>
                    <TextArea className="resize-none h-20 w-full" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <ModalFooter>
                    <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('back')}
                    </Button>
                    <Button
                        className="w-full lg:w-fit"
                        isLoading={loading}
                        disabled={userShouldIncludeDescription && !description}
                        reasonDisabled={t('reasonsDisabled.fieldEmpty')}
                        onClick={sendReportMessage}
                    >
                        {t('matching.report.modal.submitButton')}
                    </Button>
                </ModalFooter>
            </div>
        </Modal>
    );
};

export default ReportMatchModal;
