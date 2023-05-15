// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useQuery } from '@apollo/client';
import { ZoomMtg } from '@zoomus/websdk';
import { useUserType } from '../hooks/useApollo';
import { useParams } from 'react-router-dom';
import CenterLoadingSpinner from './CenterLoadingSpinner';

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
    }
    zoomZAK
    zoomSDKJWT (meetingId: $meetingId, role: $role)
}`);

const ZoomMeeting: React.FC = () => {
    const { id, type } = useParams();
    const appointmentId = parseInt(id!) || 0;

    window.onpopstate = (e) => {
        e.preventDefault();
        document.getElementById('zmmtg-root')!.style.display = 'none';
        window.location.reload();
    };

    const userType = useUserType();
    const leaveUrl = type === 'match' ? `http://localhost:3000/left-chat/${appointmentId}/match` : `http://localhost:3000/left-chat/${appointmentId}/course`;
    const role = userType === 'student' ? 1 : 0;
    console.log(appointmentId);
    const { data } = useQuery(getappointmentMeetingData, { variables: { appointmentId: appointmentId } });
    const meetingId = data?.appointment.zoomMeetingId;

    const { data: zoomData } = useQuery(getZoomCredentials, { variables: { meetingId: meetingId, role: role }, skip: !data });

    if (!zoomData) return <CenterLoadingSpinner />;

    document.getElementById('zmmtg-root')!.style.display = 'block';

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.11.5/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load('de-DE');
    ZoomMtg.i18n.reload('de-DE');

    const credentials = {
        authEndpoint: '',
        sdkKey: 'oy00hCKEQvKyxcR49FzEyw',
        password: '',
        meetingNumber: data.appointment.zoomMeetingId,
        signature: zoomData?.zoomSDKJWT || '',
        userEmail: userType === 'student' ? zoomData?.me.student?.email : zoomData?.me.pupil?.email,
        userName: userType === 'student' ? zoomData?.me.student?.firstname : zoomData?.me.pupil?.firstname,
        leaveUrl: leaveUrl,
        role: role,
        ...(zoomData?.zoomZAK ? { zak: zoomData.zoomZAK } : {}),
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
                error: (error: any) => {
                    console.log(error);
                },
            });
        },
        error: (error: any) => {
            console.log(error);
        },
    });

    return <div className="App"></div>;
};

export default ZoomMeeting;
