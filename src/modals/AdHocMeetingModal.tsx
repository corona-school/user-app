import { Button, Modal, Stack, Text, useBreakpointValue, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import { useState } from 'react';
import { ZoomInfoOptions } from './ZoomMeetingModal';

type ModalProps = {
    matchId: number;
    showAdHocModal: boolean;
    onPressBack: () => void;
};

const AdHocMeetingModal: React.FC<ModalProps> = ({ showAdHocModal, onPressBack, matchId }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const navigate = useNavigate();
    const { isMobile } = useLayoutHelper();
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

    const minWidth = useBreakpointValue({
        base: '350px',
        lg: '680px',
    });

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
        <Modal isOpen={showAdHocModal} onClose={onPressBack}>
            <Modal.Content minW={minWidth}>
                <Modal.CloseButton />
                <>
                    <Modal.Header>{t('matching.adHocMeeting.title')}</Modal.Header>
                    <Modal.Body justifyContent="center" py={4}>
                        <Text p={space['0.5']}>{t('matching.adHocMeeting.infoText')}</Text>
                        <ZoomInfoOptions />
                    </Modal.Body>
                    <Modal.Footer>
                        <Stack space={isMobile ? space['0.5'] : space['1']} direction={isMobile ? 'column' : 'row'} width="full" justifyContent="center">
                            <Button
                                width={['100%', '100%', '46%']}
                                variant="outline"
                                onPress={handleOnBrowser}
                                isLoading={isLoadingBrowserMeeting}
                                isDisabled={isLoadingZoomClientMeeting}
                            >
                                {t('matching.adHocMeeting.browser')}
                            </Button>
                            <Button
                                width={['100%', '100%', '46%']}
                                isDisabled={isLoadingBrowserMeeting}
                                onPress={handleOnZoomClient}
                                isLoading={isLoadingZoomClientMeeting}
                            >
                                {t('matching.adHocMeeting.zoomClient')}
                            </Button>
                        </Stack>
                    </Modal.Footer>
                </>
            </Modal.Content>
        </Modal>
    );
};

export default AdHocMeetingModal;
