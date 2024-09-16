import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import { useState } from 'react';
import { ZoomInfoOptions } from './ZoomMeetingModal';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';

interface ModalProps extends BaseModalProps {
    matchId: number;
}

const AdHocMeetingModal = ({ isOpen, onOpenChange, matchId }: ModalProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isBrowserMeeting, setIsBrowserMeeting] = useState(true);
    const [createAdHocMeeting, { loading: isCreatingMeeting }] = useMutation(
        gql(`
            mutation createAdHocMeeting($matchId: Int!){
                matchCreateAdHocMeeting(matchId: $matchId) {
                    id
                    appointmentType
                    zoomUrl
                }
            }
        `)
    );
    const [trackJoinMeeting] = useMutation(
        gql(`
            mutation JoinMeeting($appointmentId: Float!) { 
                appointmentTrackJoin(appointmentId: $appointmentId)
            }
        `)
    );

    const createMeeting = async () => {
        const meetingData = await createAdHocMeeting({ variables: { matchId: matchId } });
        const appointmentId = meetingData && meetingData.data?.matchCreateAdHocMeeting?.id;
        const appointmentType = meetingData && meetingData.data?.matchCreateAdHocMeeting?.appointmentType;
        const zoomUrl = meetingData && meetingData.data?.matchCreateAdHocMeeting?.zoomUrl;

        if (!appointmentId || !appointmentType) {
            throw new Error('Couldnt start ad-hoc meeting, because no appointment was found.');
        }

        await trackJoinMeeting({ variables: { appointmentId } });
        return { appointmentId, appointmentType, zoomUrl };
    };

    const handleOnBrowser = async () => {
        setIsBrowserMeeting(true);
        const response = await createMeeting();
        if (response) {
            navigate(`/video-chat/${response.appointmentId}/${response.appointmentType}`);
        }
    };

    const handleOnZoomClient = async () => {
        setIsBrowserMeeting(false);
        const response = await createMeeting();
        if (response.zoomUrl) {
            window.open(response.zoomUrl, '_self');
        } else {
            navigate(`/video-chat/${response.appointmentId}/${response.appointmentType}`);
        }
    };

    const isLoadingBrowserMeeting = isCreatingMeeting && isBrowserMeeting;
    const isLoadingZoomClientMeeting = isCreatingMeeting && !isBrowserMeeting;

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('matching.adHocMeeting.title')}</ModalTitle>
            </ModalHeader>
            <div>
                <Typography className="mb-4">{t('matching.adHocMeeting.infoText')}</Typography>
                <ZoomInfoOptions />
            </div>
            <ModalFooter>
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleOnBrowser}
                    isLoading={isLoadingBrowserMeeting}
                    disabled={isLoadingZoomClientMeeting}
                >
                    {t('matching.adHocMeeting.browser')}
                </Button>
                <Button className="w-full" disabled={isLoadingBrowserMeeting} onClick={handleOnZoomClient} isLoading={isLoadingZoomClientMeeting}>
                    {t('matching.adHocMeeting.zoomClient')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AdHocMeetingModal;
