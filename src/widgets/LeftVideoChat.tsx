// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { LectureFeedbackModal } from '@/components/LectureFeedbackModal';

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

    return (
        <div className="h-dvh w-dvw fixed bg-primary-midnight">
            {shouldShowFeedbackModal && (
                <LectureFeedbackModal feedbackId={data.appointment.myFeedback.id} isOpen={true} onOpenChange={() => {}} learningPartnerName="Max" />
            )}
        </div>
    );
};

export default LeftVideoChat;
