import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import React, { useState } from 'react';
import WithNavigation from '@/components/WithNavigation';
import { Trans, useTranslation } from 'react-i18next';
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
import { Alert } from '@/components/Alert';
import { Internship_Status_Enum } from '@/gql/graphql';
import { IconFileCertificate } from '@tabler/icons-react';
import { Badge } from '@/components/Badge';

const SupportEmail = () => (
    <a className="inline underline text-primary" href="mailto:support@lern-fair.de">
        support@lern-fair.de
    </a>
);

const query = gql(`
query Certificates {
    me {
        student {
            latestInternshipCertificate {
                id
                createdAt
            }
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
            university
            internship {
                startDate
                status
            }
        }
    }
}`);

type DownloadTarget = 'internship' | 'latest' | 'instant';

const getSemester = (startDate?: string | null) => {
    if (!startDate) return undefined;
    const date = DateTime.fromISO(startDate);
    if (!date.isValid) return undefined;
    const isWinter = date.month >= 10 || date.month <= 3;
    return { isWinter, year: date.month <= 3 ? date.year - 1 : date.year };
};

const CertificatesPage: React.FC = () => {
    const { t } = useTranslation();
    const { data } = useQuery(query);
    const navigate = useNavigate();
    const { trackEvent } = useMatomo();
    const [hasCompletedTraining, setHasCompletedTraining] = useState<CheckedState>(false);

    const [showSelectInstantPDFLanguageModal, setShowSelectInstantPDFLanguageModal] = useState<boolean>(false);
    const [downloadTarget, setDownloadTarget] = useState<DownloadTarget>('instant');

    const [requestInstantCertificateMutation, { loading: requestInstantCertificateFetching }] = useMutation(
        gql(`
            mutation RequestInstantCertificate($lang: String!) {
                instantCertificateCreate(lang: $lang)
            }
        `)
    );

    const [downloadLatestCertificateMutation, { loading: downloadLatestCertificateFetching }] = useMutation(
        gql(`
            mutation DownloadInstantCertificate($certificateId: Int!, $lang: String!) {
                downloadInstantCertificate(certificateId: $certificateId, lang: $lang)
            }
        `)
    );

    const student = data?.me.student;
    const isInternship = !!student?.isInternship;
    const hasCompletedInternship = student?.internship?.status === Internship_Status_Enum.Completed;
    const showInternshipSection = isInternship || hasCompletedInternship;
    const latestInternshipCertificate = student?.latestInternshipCertificate;
    const semester = getSemester(student?.internship?.startDate);

    const openLanguageModal = (target: DownloadTarget) => {
        setDownloadTarget(target);
        setShowSelectInstantPDFLanguageModal(true);
    };

    const downloadLatestCertificate = async (lang: 'de' | 'en') => {
        if (!latestInternshipCertificate) return;
        trackEvent({
            category: 'HuH Certificates',
            action: 'Certificate requested',
            name: 'Latest Internship Certificate downloaded',
        });
        setShowSelectInstantPDFLanguageModal(false);

        const res = await downloadLatestCertificateMutation({
            variables: { certificateId: latestInternshipCertificate.id, lang },
        });

        if (res?.data?.downloadInstantCertificate) {
            downloadFile(
                `${DateTime.now().toFormat('yyyyLLdd')}__Praktikumsbescheinigung_Lern-Fair.pdf`,
                `${BACKEND_URL}${res.data.downloadInstantCertificate}`
            );
        } else {
            toast.error(t('certificate.download.error'));
        }
    };

    const downloadInstantCertificate = async (lang: 'de' | 'en') => {
        const isInternshipCertificate = downloadTarget === 'internship';
        trackEvent({
            category: 'HuH Certificates',
            action: 'Certificate requested',
            name: isInternshipCertificate ? 'Internship Certificate downloaded' : 'Instant Certificate downloaded',
        });
        setShowSelectInstantPDFLanguageModal(false);

        const res = await requestInstantCertificateMutation({
            variables: {
                lang,
            },
        });

        if (res?.data?.instantCertificateCreate) {
            const title = isInternshipCertificate ? 'Praktikumsbescheinigung' : 'Ehrenamtsbescheinigung';
            downloadFile(`${DateTime.now().toFormat('yyyyLLdd')}__${title}_Lern-Fair.pdf`, `${BACKEND_URL}${res?.data?.instantCertificateCreate}`);
        } else {
            toast.error(t('certificate.download.error'));
        }
    };

    const handleLanguageSelected = (lang: 'de' | 'en') => (downloadTarget === 'latest' ? downloadLatestCertificate(lang) : downloadInstantCertificate(lang));

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
                {showInternshipSection && (
                    <section className="mb-8">
                        <Typography variant="h3" className="mb-4">
                            {t('certificates.internshipCertificate.title')}
                        </Typography>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 w-fit mb-4 px-3 py-2 rounded-sm border-l-4 border-primary/40 bg-primary-lighter text-sm">
                            {student?.university && (
                                <>
                                    <span className="font-bold">{student.university}</span>
                                    <span className="h-4 w-px bg-primary/20" />
                                </>
                            )}
                            {semester && (
                                <>
                                    <span>
                                        {t(
                                            semester.isWinter
                                                ? 'certificates.internshipCertificate.winterSemester'
                                                : 'certificates.internshipCertificate.summerSemester',
                                            {
                                                year: semester.year,
                                            }
                                        )}
                                    </span>
                                    <span className="h-4 w-px bg-primary/20" />
                                </>
                            )}
                            <span>{t('certificates.internshipCertificate.status')}:</span>
                            <Badge
                                variant="outline"
                                className={`gap-1.5 rounded-full border-transparent ${
                                    isInternship ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}
                            >
                                <span className="size-1.5 rounded-full bg-current" />
                                {t(isInternship ? 'certificates.internshipCertificate.statusActive' : 'certificates.internshipCertificate.statusCompleted')}
                            </Badge>
                        </div>
                        <div className="flex flex-col">
                            <BulletList bulletPoints={t('certificates.internshipCertificate.bullets', { returnObjects: true })} />
                        </div>

                        {isInternship ? (
                            <Button onClick={() => openLanguageModal('internship')} className="my-2" isLoading={requestInstantCertificateFetching}>
                                {t('certificates.internshipCertificate.download')}
                            </Button>
                        ) : (
                            latestInternshipCertificate && (
                                <div className="flex flex-col gap-1 w-[220px] mt-3 p-4 rounded-md bg-primary-lighter">
                                    <div className="flex items-center justify-center size-10 mb-2 rounded-md bg-white text-primary">
                                        <IconFileCertificate size={24} />
                                    </div>
                                    <Typography className="font-semibold">{t('certificates.internshipCertificate.title')}</Typography>
                                    <Typography className="text-xs text-gray-500">
                                        {t('certificates.internshipCertificate.createdAt', {
                                            date: DateTime.fromISO(latestInternshipCertificate.createdAt).toFormat('dd.MM.yyyy'),
                                        })}
                                    </Typography>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-2 bg-white"
                                        onClick={() => openLanguageModal('latest')}
                                        isLoading={downloadLatestCertificateFetching}
                                    >
                                        {t('certificates.internshipCertificate.downloadFinal')}
                                    </Button>
                                </div>
                            )
                        )}
                    </section>
                )}

                <Typography variant="h3" className="mb-4">
                    {t('certificates.instantCertificate.title')}
                </Typography>
                <div className="flex flex-col">
                    <BulletList bulletPoints={t('certificates.instantCertificate.bullets', { returnObjects: true })} />
                </div>
                <Button onClick={() => openLanguageModal('instant')} className="my-2" disabled={isInternship} isLoading={requestInstantCertificateFetching}>
                    {t('certificates.instantCertificate.request')}
                </Button>
                {isInternship && <Typography className="text-xs text-gray-500">{t('certificates.instantCertificate.unavailableDuringInternship')}</Typography>}

                <Modal isOpen={showSelectInstantPDFLanguageModal} onOpenChange={setShowSelectInstantPDFLanguageModal} className="w-[400px]">
                    <ModalHeader>
                        <ModalTitle>{t('certificate.download.download_certificate')}</ModalTitle>
                    </ModalHeader>
                    <div className="flex flex-col gap-2">
                        {downloadTarget === 'internship' && (
                            <div className="flex gap-x-2 items-center mb-4">
                                <Checkbox id="hasCompletedTraining" checked={hasCompletedTraining} onCheckedChange={setHasCompletedTraining} />{' '}
                                <Label htmlFor="hasCompletedTraining">
                                    <Trans
                                        i18nKey="certificate.download.confirmationText"
                                        components={{
                                            link: (
                                                <a className="inline underline text-primary" href="mailto:support@lern-fair.de">
                                                    support@lern-fair.de
                                                </a>
                                            ),
                                        }}
                                    ></Trans>
                                </Label>
                            </div>
                        )}
                        <Button className="w-full" onClick={() => handleLanguageSelected('de')}>
                            {t('certificate.download.german_version')}
                        </Button>
                        <Button className="w-full" onClick={() => handleLanguageSelected('en')}>
                            {t('certificate.download.english_version')}
                        </Button>
                    </div>
                </Modal>

                {/* <Typography variant="h3" className="mb-4 mt-4">
                    {t('certificates.participationCertificate.title')}
                </Typography>
                <div className="flex flex-col">
                    <BulletList bulletPoints={t('certificates.participationCertificate.bullets', { returnObjects: true })} />
                </div>
                <Button onClick={handleRequestCertificate} className="my-2">
                    {t('profile.Helper.certificate.button')}
                </Button> */}
                <Alert className="md:max-w-[80%] my-4" title={t('certificates.participationCertificate.title')} variant="default">
                    <Typography>
                        <Trans
                            i18nKey={'certificates.participationCertificate.deactivated'}
                            components={[<SupportEmail />]}
                            values={{ email: 'support@lern-fair.de' }}
                        ></Trans>
                    </Typography>
                </Alert>
                <div className="flex flex-row gap-3">
                    {student?.participationCertificates.map((certificate, i) => (
                        <MatchCertificateCard certificate={certificate} key={i} />
                    ))}
                </div>
            </WithNavigation>
        </>
    );
};

export default CertificatesPage;
