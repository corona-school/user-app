import { useMutation } from '@apollo/client';
import { useState, useCallback } from 'react';
import { BACKEND_URL } from '../../config';
import { gql } from '../../gql';
import { Participation_Certificate } from '../../gql/graphql';
import CertificateMatchIcon from '../../assets/icons/lernfair/lf-certificate-matching.svg';
import { useTranslation } from 'react-i18next';
import DisableableButton from '../../components/DisablebleButton';
import { ProgressSpinnerModal } from '../../components/ProgressSpinnerModal';
import { downloadFile } from '../../helper/download-file';
import { Modal, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { useToast } from 'native-base';
import { Typography } from '@/components/Typography';

type Certificate = Pick<
    Participation_Certificate,
    'uuid' | 'categories' | 'endDate' | 'hoursPerWeek' | 'hoursTotal' | 'medium' | 'ongoingLessons' | 'startDate' | 'state'
> & { pupil: { firstname?: string | null; lastname?: string | null } };

export const MatchCertificateCard = ({ certificate }: { certificate: Certificate }) => {
    const toast = useToast();
    const { t } = useTranslation();

    const [showSelectPDFLanguageModal, setShowSelectPDFLanguageModal] = useState<boolean>(false);
    const [downloadStep, setDownloadStep] = useState<'' | 'create' | 'download'>('');

    const [requestCertificate, requestCertificateState] = useMutation(
        gql(`
            mutation GetCertificate($lang: String!, $uuid: String!) {
                participationCertificateAsPDF(language: $lang, uuid: $uuid)
            }
        `)
    );

    const downloadCertificate = useCallback(
        async (lang: 'de' | 'en') => {
            setShowSelectPDFLanguageModal(false);
            setDownloadStep('create');

            const res = await requestCertificate({
                variables: {
                    lang,
                    uuid: certificate.uuid,
                },
            });

            setDownloadStep('download');

            if (res?.data?.participationCertificateAsPDF) {
                downloadFile(`Lernfair_Zertifikat_${Date.now()}.pdf`, `${BACKEND_URL}${res?.data?.participationCertificateAsPDF}`);
            } else {
                toast.show({ description: t('certificate.download.error'), placement: 'top' });
            }

            setDownloadStep('');
        },
        [t, certificate, requestCertificate, toast]
    );

    return (
        <>
            {downloadStep === 'create' && (
                <ProgressSpinnerModal
                    isOpen
                    onOpenChange={() => {}}
                    title={t('certificate.download.download_certificate')}
                    description={t('certificate.download.create')}
                />
            )}
            {downloadStep === 'download' && (
                <ProgressSpinnerModal
                    isOpen
                    onOpenChange={() => {}}
                    title={t('certificate.download.download_certificate')}
                    description={t('certificate.download.download_browser')}
                />
            )}
            <div className="max-w-300 bg-primary-lighter py-4 px-5 rounded-md">
                <div className="flex flex-col">
                    <div className="justify-end items-center">
                        <div>
                            <CertificateMatchIcon />
                        </div>
                        <Typography variant="h4">
                            {certificate.pupil.firstname} {certificate.pupil.lastname}
                        </Typography>
                    </div>
                    <div className="flex flex-col">
                        <Typography>
                            <Typography className="font-bold">{t('certificate.download.state')}: </Typography>
                            <Typography>
                                {{
                                    manual: t('certificate.download.state_manual'),
                                    'awaiting-approval': t('certificate.download.state_awaiting'),
                                    approved: t('certificate.download.state_approved'),
                                }[certificate.state] ?? certificate.state}
                            </Typography>
                        </Typography>
                    </div>
                    <DisableableButton
                        isDisabled={certificate.state === 'awaiting-approval' || requestCertificateState.loading}
                        reasonDisabled={requestCertificateState.loading ? t('reasonsDisabled.loading') : t('certificate.download.reasonBtnDisabled')}
                        variant="outline"
                        onPress={() => setShowSelectPDFLanguageModal(true)}
                    >
                        {t('certificate.download.download')}
                    </DisableableButton>
                </div>
            </div>
            <Modal isOpen={showSelectPDFLanguageModal} onOpenChange={setShowSelectPDFLanguageModal} className="w-[400px]">
                <ModalHeader>
                    <ModalTitle>{t('certificate.download.download_certificate')}</ModalTitle>
                </ModalHeader>
                <div className="flex flex-col gap-2">
                    <Button className="w-full" onClick={() => downloadCertificate('de')}>
                        {t('certificate.download.german_version')}
                    </Button>
                    <Button className="w-full" onClick={() => downloadCertificate('en')}>
                        {t('certificate.download.english_version')}
                    </Button>
                </div>
            </Modal>
        </>
    );
};
