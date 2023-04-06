import { gql, useMutation } from '@apollo/client';
import { useToast } from 'native-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SetMeetingLinkModal from '../../../modals/SetMeetingLinkModal';

type Props = {
    subcourseId: number;
    refresh: () => void;
};

const StudentSetMeetingUrl: React.FC<Props> = ({ subcourseId, refresh }) => {
    const [showMeetingUrlModal, setShowMeetingUrlModal] = useState(false);

    const toast = useToast();
    const { t } = useTranslation();

    const [setMeetingUrl, { data, loading }] = useMutation(
        gql(`
    mutation setMeetingUrl($subcourseId: Float!, $meetingUrl: String!) {
        subcourseSetMeetingURL(subcourseId: $subcourseId, meetingURL: $meetingUrl)
    }
    `)
    );

    const _setMeetingLink = useCallback(
        async (link: string) => {
            try {
                const res = await setMeetingUrl({
                    variables: {
                        subcourseId: subcourseId,
                        meetingUrl: link,
                    },
                });

                setShowMeetingUrlModal(false);
                if (res.data?.subcourseSetMeetingURL) {
                    toast.show({
                        description: t('course.meeting.result.success'),
                        placement: 'top',
                    });
                } else {
                    toast.show({
                        description: t('course.meeting.result.error'),
                        placement: 'top',
                    });
                }
            } catch (e) {
                toast.show({
                    description: t('course.meeting.result.error'),
                    placement: 'top',
                });
            }
        },
        [subcourseId, setMeetingUrl, t, toast]
    );

    return (
        <>
            <SetMeetingLinkModal
                isOpen={showMeetingUrlModal}
                onClose={() => setShowMeetingUrlModal(false)}
                disableButtons={loading}
                onPressStartMeeting={(link) => _setMeetingLink(link)}
            />
        </>
    );
};

export default StudentSetMeetingUrl;
