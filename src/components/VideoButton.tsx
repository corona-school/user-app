import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import DisableableButton from './DisablebleButton';
import { gql } from '../gql';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Modal } from 'native-base';
import ZoomMeetingModal from '../modals/ZoomMeetingModal';
import { useState } from 'react';

type VideoButtonProps = {
    isInstructor?: boolean;
    appointmentId: number;
    appointmentType: Lecture_Appointmenttype_Enum;
    canJoinMeeting: boolean;
    width?: number;
    buttonText?: string;
    isOver?: boolean;
    overrideLink?: string;
};

const VideoButton: React.FC<VideoButtonProps> = ({
    isInstructor = false,
    canJoinMeeting,
    appointmentId,
    appointmentType,
    width,
    buttonText,
    isOver = false,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [loadLink, { loading }] = useLazyQuery(
        gql(`
query overrrideLink($appointmentId: Float!) {
    appointment(appointmentId: $appointmentId) {
        override_meeting_link
        zoomMeetingUrl
    }
}
`),
        { variables: { appointmentId } }
    );
    const { data: zoomData } = useQuery(
        gql(`
query zoomMeetingUrl($appointmentId: Float!) {
    appointment(appointmentId: $appointmentId) {
        zoomMeetingUrl
    }
}
`),
        { variables: { appointmentId } }
    );

    const openMeeting = async () => {
        const { data } = await loadLink();

        const overrideLink = data?.appointment?.override_meeting_link;
        if (overrideLink == null) {
            navigate(`/video-chat/${appointmentId}/${appointmentType}`);
        } else {
            window.open(overrideLink, '_self');
        }
    };

    return (
        <>
            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <ZoomMeetingModal appointmentId={appointmentId} appointmentType={appointmentType} zoomUrl={zoomData?.appointment.zoomMeetingUrl ?? undefined} />
            </Modal>
            <DisableableButton
                isDisabled={!canJoinMeeting || isOver}
                reasonDisabled={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')}
                width={width ?? width}
                onPress={() => setIsOpenModal(true)}
            >
                {buttonText ? buttonText : isInstructor ? t('course.meeting.videobutton.student') : t('course.meeting.videobutton.pupil')}
            </DisableableButton>
        </>
    );
};

export default VideoButton;
