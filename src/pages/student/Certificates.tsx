import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import React, { useState } from 'react';
import WithNavigation from '@/components/WithNavigation';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Typography } from '@/components/Typography';
import BulletList from '@/components/BulletList';
import { MatchCertificateCard } from '@/widgets/certificates/MatchCertificateCard';
import { gql } from '@/gql';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { downloadFile } from '@/helper/download-file';
import { BACKEND_URL } from '@/config';
import { Modal, ModalHeader, ModalTitle } from '@/components/Modal';
import { toast } from 'sonner';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Checkbox, CheckedState } from '@/components/Checkbox';
import { Label } from '@/components/Label';
import { DateTime } from 'luxon';

const query = gql(`
query Certificates {
    me {
        student {
            participationCertificates {
                uuid
                categories
                endDate
                hoursPerWeek
                hoursTotal
                medium
                ongoingLessons
                startDate
                state
                pupil {firstname lastname}
            }
            isInternship
        }
    }
}`);

const CertificatesPage: React.FC = () => {
    const { t } = useTranslation();
    const { data } = useQuery(query);
    const navigate = useNavigate();
    const { trackEvent } = useMatomo();
    const [hasCompletedTraining, setHasCompletedTraining] = useState<CheckedState>(false);

    const [showSelectInstantPDFLanguageModal, setShowSelectInstantPDFLanguageModal] = useState<boolean>(false);

    const [requestInstantCertificateMutation, { loading: requestInstantCertificateFetching }] = useMutation(
        gql(`
            mutation RequestInstantCertificate($lang: String!, $hasCompletedTraining: Boolean!) {
                instantCertificateCreate(lang: $lang, hasCompletedTraining: $hasCompletedTraining)
            }
        `)
    );

    const downloadInstantCertificate = async (lang: 'de' | 'en') => {
        trackEvent({
            category: 'HuH Certificates',
            action: 'Certificate requested',
            name: 'Instant Certificate downloaded',
        });
        setShowSelectInstantPDFLanguageModal(false);

        const res = await requestInstantCertificateMutation({
            variables: {
                lang,
                hasCompletedTraining: hasCompletedTraining === true,
            },
        });

        if (res?.data?.instantCertificateCreate) {
            const title = data?.me.student?.isInternship ? 'Praktikumsbescheinigung' : 'Ehrenamtsbescheinigung';
            downloadFile(`${DateTime.now().toFormat('YYYYMMDD')}__${title}_Lern-Fair.pdf`, `${BACKEND_URL}${res?.data?.instantCertificateCreate}`);
        } else {
            toast.error(t('certificate.download.error'));
        }
    };

    const handleRequestCertificate = () => {
        trackEvent({
            category: 'HuH Certificates',
            action: 'Certificate requested',
            name: 'Customized Certificate requested',
        });
        navigate('/request-certificate');
    };

    return (
        <>
            <WithNavigation
                headerTitle={t('appointment.title')}
                previousFallbackRoute="/settings"
                headerLeft={
                    <div className="flex items-center">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                <Breadcrumb />
                <Typography variant="h2" className="mb-4">
                    {t('certificates.title')}
                </Typography>
                <Typography variant="h3" className="mb-4">
                    {t(data?.me.student?.isInternship ? 'certificates.instantCertificate.titleForInternship' : 'certificates.instantCertificate.title')}
                </Typography>
                <div className="flex flex-col">
                    <BulletList bulletPoints={t('certificates.instantCertificate.bullets', { returnObjects: true })} />
                </div>
                <Button onClick={() => setShowSelectInstantPDFLanguageModal(true)} className="my-2" isLoading={requestInstantCertificateFetching}>
                    {t('certificates.instantCertificate.request')}
                </Button>

                <Modal isOpen={showSelectInstantPDFLanguageModal} onOpenChange={setShowSelectInstantPDFLanguageModal} className="w-[400px]">
                    <ModalHeader>
                        <ModalTitle>{t('certificate.download.download_certificate')}</ModalTitle>
                    </ModalHeader>
                    <div className="flex flex-col gap-2">
                        {data?.me.student?.isInternship && (
                            <div className="flex gap-x-2 items-center mb-4">
                                <Checkbox id="hasCompletedTraining" checked={hasCompletedTraining} onCheckedChange={setHasCompletedTraining} />{' '}
                                <Label htmlFor="hasCompletedTraining">{t('certificate.download.trainingCompletedLabel')}</Label>
                            </div>
                        )}
                        <Button className="w-full" onClick={() => downloadInstantCertificate('de')}>
                            {t('certificate.download.german_version')}
                        </Button>
                        <Button className="w-full" onClick={() => downloadInstantCertificate('en')}>
                            {t('certificate.download.english_version')}
                        </Button>
                    </div>
                </Modal>

                <Typography variant="h3" className="mb-4 mt-4">
                    {t('certificates.participationCertificate.title')}
                </Typography>
                <div className="flex flex-col">
                    <BulletList bulletPoints={t('certificates.participationCertificate.bullets', { returnObjects: true })} />
                </div>
                <Button onClick={handleRequestCertificate} className="my-2">
                    {t('profile.Helper.certificate.button')}
                </Button>
                <div className="flex flex-row gap-3">
                    {data?.me.student?.participationCertificates.map((certificate, i) => (
                        <MatchCertificateCard certificate={certificate} key={i} />
                    ))}
                </div>
            </WithNavigation>
        </>
    );
};

export default CertificatesPage;
