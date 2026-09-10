import { Trans, useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import CheckBadge from '../assets/icons/check-badge.svg';
import CameraIcon from '../assets/icons/camera-icon.svg';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { LectureFeedbackModal } from '@/components/LectureFeedbackModal';

const GET_APPOINTMENT_FEEDBACK_QUERY = gql(`
    query appointmentFeedback($appointmentId: Float!) {
        appointment(appointmentId: $appointmentId) {
            myFeedback {
                id
                status
                isReadyForFeedback
            }
        }
    }
`);

interface ZoomMeetingModalProps extends BaseModalProps {
    appointmentId: number;
    appointmentType: Lecture_Appointmenttype_Enum;
    zoomUrl: string | undefined;
}

enum ZoomInfoIconEnum {
    CHECK = 'check',
    CAMERA = 'camera',
}

type ZoomInfo = { icon: ZoomInfoIconEnum; label: string };

export const ZoomInfoOptions = () => {
    const { t } = useTranslation();
    const zoomInfos: ZoomInfo[] = [
        {
            icon: ZoomInfoIconEnum.CHECK,
            label: 'useZoomApp',
        },
        { icon: ZoomInfoIconEnum.CAMERA, label: 'camera' },
    ];
    return (
        <div className="flex flex-col gap-y-2">
            {zoomInfos.map((info) => (
                <div className="flex items-center gap-x-1" key={info.label}>
                    <div className="flex flex-col">
                        <div className="pr-3 lg:pr-4">{info.icon === ZoomInfoIconEnum.CHECK ? <CheckBadge /> : <CameraIcon />}</div>
                    </div>
                    <div className="flex flex-col">
                        <Typography variant="h6">{t(`appointment.zoomModal.${info.label}.header` as any)}</Typography>
                        <Typography className="text-detail">
                            <Trans i18nKey={`appointment.zoomModal.${info.label}.description` as any} components={{ b: <b />, br: <br /> }} />
                        </Typography>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ZoomMeetingModal: React.FC<ZoomMeetingModalProps> = ({ isOpen, onOpenChange, appointmentId, appointmentType, zoomUrl }) => {
    const { t } = useTranslation();
    const [hasAttemptedJoinMeeting, setHasAttemptedJoinMeeting] = useState(false);
    const [showLectureFeedbackModal, setShowLectureFeedbackModal] = useState(false);
    const { data, refetch } = useQuery(GET_APPOINTMENT_FEEDBACK_QUERY, { variables: { appointmentId }, skip: !isOpen && !hasAttemptedJoinMeeting });

    useEffect(() => {
        const onFocus = () => {
            if (hasAttemptedJoinMeeting) {
                refetch();
            }
        };

        window.addEventListener('focus', onFocus);

        return () => {
            window.removeEventListener('focus', onFocus);
        };
    }, [hasAttemptedJoinMeeting]);

    useEffect(() => {
        if (data?.appointment?.myFeedback?.isReadyForFeedback && hasAttemptedJoinMeeting) {
            setShowLectureFeedbackModal(true);
            onOpenChange(false);
        }
    }, [data, hasAttemptedJoinMeeting]);

    const handleOnContinueInBrowser = () => {
        setHasAttemptedJoinMeeting(true);
        window.open(`/video-chat/${appointmentId}/${appointmentType}`);
    };

    const handleContinueInZoomApp = () => {
        setHasAttemptedJoinMeeting(true);
        window.open(zoomUrl, '_blank');
    };

    const shouldShowFeedbackModal = data?.appointment?.myFeedback?.id && data?.appointment?.myFeedback?.isReadyForFeedback;

    return (
        <>
            <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
                <ModalHeader>
                    <ModalTitle>{t('appointment.zoomModal.header')}</ModalTitle>
                </ModalHeader>
                <div>
                    <ZoomInfoOptions />
                </div>
                <ModalFooter>
                    <Button className="w-full" variant="outline" onClick={handleOnContinueInBrowser}>
                        {t('appointment.zoomModal.browser')}
                    </Button>
                    <Button className="w-full" disabled={!zoomUrl} onClick={handleContinueInZoomApp}>
                        {t('appointment.zoomModal.zoomClient')}
                    </Button>
                </ModalFooter>
            </Modal>
            {shouldShowFeedbackModal && (
                <LectureFeedbackModal
                    isOpen={showLectureFeedbackModal}
                    onOpenChange={setShowLectureFeedbackModal}
                    feedbackId={data?.appointment?.myFeedback?.id!}
                    learningPartnerName="Max"
                />
            )}
        </>
    );
};

export default ZoomMeetingModal;
