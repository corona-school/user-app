// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql } from '../../src/gql';
import { ZoomMtg } from '@zoomus/websdk';
import { useUserType } from '../hooks/useApollo';
import { useParams } from 'react-router-dom';
import CenterLoadingSpinner from './CenterLoadingSpinner';
import { useEffect } from 'react';
import { ZOOM_MEETING_SDK_KEY } from '../config';
import { useQuery } from '@apollo/client';

enum ZoomMeetingRole {
    Host = 1,
    Participant = 0,
}

const getappointmentMeetingData = gql(`
query appointmentMeetingData($appointmentId: Float!) {
    appointment(appointmentId: $appointmentId) {
        zoomMeetingId
    }
}`);

const getZoomCredentials = gql(`
query zoom($meetingId: String!, $role: Float!) {
    me {
        pupil {
            firstname
            lastname
            email
        }
        student {
            firstname
            lastname
            email
        }
        zoomZAK
        zoomSDKJWT (meetingId: $meetingId, role: $role)
    }
}`);

const ZoomMeeting: React.FC = () => {
    const { id, type } = useParams();

    if (!id) {
        throw new Error('No appointment id provided');
    }

    const appointmentId = parseInt(id);

    const userType = useUserType();
    const leaveUrl = type === 'match' ? `/left-chat/${appointmentId}/match` : `/left-chat/${appointmentId}/course`;
    const role = userType === 'student' ? ZoomMeetingRole.Host : ZoomMeetingRole.Participant;

    const { data, loading: isLoadingAppointmentData } = useQuery(getappointmentMeetingData, { variables: { appointmentId: appointmentId } });
    const meetingId = data?.appointment.zoomMeetingId;

    const { data: zoomData } = useQuery(getZoomCredentials, { variables: { meetingId: meetingId!, role: role }, skip: !meetingId || isLoadingAppointmentData });

    useEffect(() => {
        const handlePopState = () => {
            window.location.reload();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        if (!zoomData) return;

        if (!meetingId) throw new Error('No meeting id provided');

        document.getElementById('zmmtg-root')!.style.display = 'block';

        ZoomMtg.setZoomJSLib('https://source.zoom.us/2.11.5/lib', '/av');
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
        ZoomMtg.i18n.load('de-DE');
        ZoomMtg.i18n.reload('de-DE');

        const credentials = {
            authEndpoint: '',
            sdkKey: ZOOM_MEETING_SDK_KEY,
            password: '',
            meetingNumber: meetingId,
            signature: zoomData.me.zoomSDKJWT,
            userEmail: userType === 'student' ? zoomData.me.student?.email : zoomData?.me.pupil?.email,
            userName: userType === 'student' ? zoomData.me.student?.firstname : zoomData?.me.pupil?.firstname,
            leaveUrl: leaveUrl,
            role: role,
            ...(zoomData.me.zoomZAK ? { zak: zoomData.me.zoomZAK } : {}),
        };

        ZoomMtg.init({
            leaveUrl: credentials.leaveUrl,
            success: () => {
                ZoomMtg.join({
                    signature: credentials.signature,
                    sdkKey: credentials.sdkKey,
                    meetingNumber: credentials.meetingNumber,
                    passWord: '',
                    userName: credentials.userName || '',
                    userEmail: credentials.userEmail,
                    zak: credentials.zak,
                    success: (success: any) => {
                        console.log(success);
                    },
                    error: (error: Error) => {
                        throw new Error("User couldn't join Zoom meeting", { cause: error });
                    },
                });
            },
            error: (error: Error) => {
                throw new Error("Couldn't init Zoom SDK", { cause: error });
            },
        });
    }, [zoomData]);

    if (!zoomData) return <CenterLoadingSpinner />;

    return null;
};

export default ZoomMeeting;
