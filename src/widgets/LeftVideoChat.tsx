// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LectureFeedbackModal } from '@/components/LectureFeedbackModal';
import PartyIcon from '../assets/icons/lernfair/lf-party.svg';
import { Button } from '@/components/Button';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography';

// Duplicated from ZoomMeeting.tsx to avoid the dependency to the lazy loaded component
export function removeZoomStyles() {
    document.getElementById('zmmtg-root')!.style.display = 'none';
}

const getAppointmentOrganizer = gql(`
query appointmentOrganizer($appointmentId: Float!) {
    appointment(appointmentId: $appointmentId) {
        isOrganizer
        zoomMeetingId
        myFeedback {
            id
            status
            isReadyForFeedback
        }
    }
}`);

const LeftVideoChat: React.FC = () => {
    const { id: appointmentId, type } = useParams();
    const idAsInt = appointmentId ? parseInt(appointmentId) : null;
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const { data, loading } = useQuery(getAppointmentOrganizer, { variables: { appointmentId: idAsInt } });
    const isOrganizer = data?.appointment.isOrganizer;

    const navigate = useNavigate();

    const chatType = type === 'course' ? 'course' : 'oneOnOne';

    const [appointmentSaveMeetingReport] = useMutation(
        gql(`
        mutation appointmentSaveMeetingReport($appointmentId: Float!) {
            appointmentSaveMeetingReport(appointmentId: $appointmentId)
        }
    `)
    );

    useEffect(() => {
        removeZoomStyles();
        (async () => {
            if (isOrganizer) {
                await appointmentSaveMeetingReport({ variables: { appointmentId: idAsInt } });
            }
        })();
    }, []);

    useEffect(() => {
        if (!loading && data) {
            (async () => {
                if (isOrganizer) {
                    await appointmentSaveMeetingReport({ variables: { appointmentId: idAsInt } });
                }
            })();
        }
    }, [loading]);

    const saveAndFinish = async () => {
        navigate('/');
    };

    const shouldShowFeedbackModal = data?.appointment?.myFeedback?.isReadyForFeedback && chatType === 'oneOnOne';

    const handleOnOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            navigate('/');
        }
    };

    useEffect(() => {
        if (shouldShowFeedbackModal) {
            setIsOpen(true);
        }
    }, [shouldShowFeedbackModal]);

    return (
        <div className="h-dvh w-dvw fixed bg-primary-midnight flex flex-1 flex-col justify-center items-center p-6 gap-y-3 gap-x-3">
            <LectureFeedbackModal feedbackId={data.appointment.myFeedback.id} isOpen={isOpen} onOpenChange={handleOnOpenChange} learningPartnerName="Max" />
            <div className="mb-2">
                <PartyIcon />
            </div>
            <div className="flex flex-col">
                <Typography variant="h4" className="text-center font-bold leading-normal text-white">
                    {t(`chat.${chatType}.leftVideoChat.title`)}
                </Typography>

                <Typography className="text-center font-normal text-white">{t(`chat.${chatType}.leftVideoChat.subtitle`)}</Typography>
            </div>

            <Button variant="secondary" type="button" onClick={saveAndFinish}>
                <span className="text-sm">{t(`chat.${chatType}.leftVideoChat.button`)}</span>
            </Button>
        </div>
    );
};

export default LeftVideoChat;
