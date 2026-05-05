import { useTranslation } from 'react-i18next';
import { Subject } from '../gql/graphql';
import SubjectList from './SubjectList';
import { IconAlertTriangleFilled, IconCalendarPlus, IconCheck, IconEdit, IconTrash, IconVideo } from '@tabler/icons-react';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { Alert } from '@/components/Alert';
import { DateTime } from 'luxon';
import i18next from '@/I18n';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { toast } from 'sonner';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';
import { PupilScreening } from '@/types';

const CANCEL_PUPIL_MATCH_REQUEST_MUTATION = gql(`
    mutation PupilDeleteMatchRequest {
        pupilDeleteMatchRequest
    }
`);

const CANCEL_STUDENT_MATCH_REQUEST_MUTATION = gql(`
    mutation StudentDeleteMatchRequest {
        studentDeleteMatchRequest
    }
`);

interface OpenMatchRequestProps {
    subjects: Subject[];
    index: number;
    screening?: Partial<PupilScreening> | null;
    onMatchRequestCancelled?: () => void;
    variant: 'pupil' | 'student';
}

const OpenMatchRequest = ({ subjects, index, screening, variant, onMatchRequestCancelled }: OpenMatchRequestProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { trackEvent } = useMatomo();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [cancelMatchRequest, { loading: isCancelling }] = useMutation(
        variant === 'pupil' ? CANCEL_PUPIL_MATCH_REQUEST_MUTATION : CANCEL_STUDENT_MATCH_REQUEST_MUTATION
    );
    const screeningAppointment = screening?.appointment;
    const canStartMeeting = useCanJoinMeeting({
        joinBeforeMinutes: 15,
        appointment: { start: screeningAppointment?.start!, duration: screeningAppointment?.duration! },
    });

    const handleOnCancel = async () => {
        trackEvent({
            category: 'matching',
            action: 'click-event',
            name: `${variant === 'pupil' ? 'Schüler' : 'Helfer'} Matching Anfrage löschen`,
            documentTitle: `${variant === 'pupil' ? 'Schüler' : 'Helfer'} Matching`,
        });
        const res = await cancelMatchRequest();
        // @ts-ignore
        if (res.data?.pupilDeleteMatchRequest || res.data?.studentDeleteMatchRequest) {
            toast.success(t('matching.request.check.deleteSucess'));
        }
        setShowCancelModal(false);
        onMatchRequestCancelled && onMatchRequestCancelled();
    };

    return (
        <>
            <div className="mr-4 mb-4 w-full max-w-[600px]">
                <div className="bg-primary-lighter p-6 rounded-md">
                    <Typography variant="h5">
                        {t('matching.request.check.request')} {`${index + 1}`.padStart(2, '0')}
                    </Typography>

                    <div className="mt-3 flex flex-col space-y-2">
                        <Typography className="font-bold">{t('matching.shared.subjects')}</Typography>
                        {subjects && <SubjectList subjects={subjects} />}
                    </div>
                    <div className="mt-3">
                        {screeningAppointment ? (
                            <Alert
                                icon={
                                    <div className="bg-green-500 rounded-full w-[24px] h-[24px] inline-flex justify-center items-center mx-auto mr-1">
                                        <IconCheck size={12} className="stroke-white !stroke-[2px]" />
                                    </div>
                                }
                                rightElement={
                                    <Button
                                        variant="ghost-light"
                                        className="text-primary w-full lg:w-auto lg:ml-auto"
                                        leftIcon={<IconEdit size={18} />}
                                        onClick={() => {
                                            if (screeningAppointment?.actionUrls?.rescheduleUrl) {
                                                window.open(screeningAppointment.actionUrls.rescheduleUrl, '_blank');
                                            }
                                        }}
                                    >
                                        {t('changeAppointment')}
                                    </Button>
                                }
                                variant="success"
                                className="border border-solid border-green-300 w-full mb-4 flex-col items-center lg:flex-row"
                            >
                                <div className="flex flex-col flex-1">
                                    <Typography variant="subtle" className="text-primary mb-1">
                                        {t('matching.shared.appointmentBookedHint')}
                                    </Typography>
                                    <Typography variant="subtle" className="font-bold text-primary">
                                        {screeningAppointment &&
                                            DateTime.fromISO(screeningAppointment.start).toFormat('EEEE, dd. MMMM t', { locale: i18next.language })}{' '}
                                        {t('clock')}
                                    </Typography>
                                </div>
                            </Alert>
                        ) : (
                            <Alert
                                icon={<IconAlertTriangleFilled size={24} className="text-red-400" />}
                                variant="destructive"
                                className="border border-solid border-red-400 w-full mb-4"
                            >
                                <div className="flex flex-col flex-1">
                                    <Typography variant="subtle" className="text-primary mb-1 font-bold">
                                        {t('matching.shared.needsToBookAppointmentHint')}
                                    </Typography>
                                    <Typography variant="subtle" className="text-primary">
                                        {t('matching.shared.needsToBookAppointmentDesc')}
                                    </Typography>
                                </div>
                            </Alert>
                        )}
                    </div>
                    <div className="flex flex-col gap-y-3 lg:flex-row lg:gap-x-3">
                        <Button
                            disabled={isCancelling}
                            reasonDisabled={t('reasonsDisabled.loading')}
                            onClick={() => setShowCancelModal(true)}
                            variant="optional-dark"
                            leftIcon={<IconTrash size={16} />}
                            size="sm"
                            className="px-4 w-full lg:w-auto"
                        >
                            {t('matching.request.check.removeRequest')}
                        </Button>
                        <Button
                            disabled={isCancelling}
                            reasonDisabled={t('reasonsDisabled.loading')}
                            onClick={() => setShowEditModal(true)}
                            variant="optional-dark"
                            leftIcon={<IconEdit size={16} />}
                            size="sm"
                            className="px-4 w-full lg:w-auto"
                        >
                            {t('matching.request.check.editRequest')}
                        </Button>
                        {!screeningAppointment && (
                            <Button
                                disabled={isCancelling}
                                reasonDisabled={t('reasonsDisabled.loading')}
                                onClick={() => navigate('/request-match/screening-appointment')}
                                leftIcon={<IconCalendarPlus size={16} />}
                                size="sm"
                                className="px-4 w-full lg:w-auto"
                            >
                                {t('bookAppointment')}
                            </Button>
                        )}
                        {screeningAppointment && (
                            <Button
                                disabled={!canStartMeeting}
                                reasonDisabled={`${t('requireScreening.appointment.joinMeetingHint', { minutes: 15 })}`}
                                onClick={() => screeningAppointment?.override_meeting_link && window.open(screeningAppointment.override_meeting_link, '_blank')}
                                leftIcon={<IconVideo />}
                                variant="zoom"
                                className="px-4 w-full lg:w-auto"
                            >
                                {t('joinZoomMeeting')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmationModal
                isOpen={!!showCancelModal}
                onOpenChange={setShowCancelModal}
                confirmButtonText={t('matching.request.check.deleteRequest')}
                headline={t('matching.request.check.deleteRequest')}
                description={t('matching.request.check.areyousuretodelete')}
                onConfirm={handleOnCancel}
                variant="destructive"
            />
            <ConfirmationModal
                isOpen={!!showEditModal}
                onOpenChange={setShowEditModal}
                confirmButtonText={t('edit')}
                headline={t('matching.request.check.editRequest')}
                description={t('matching.request.check.editRequestDescription')}
                onConfirm={() =>
                    navigate('/request-match', {
                        state: { edit: true },
                    })
                }
            />
        </>
    );
};
export default OpenMatchRequest;
