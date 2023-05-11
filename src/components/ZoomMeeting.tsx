import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import { ZoomMtg } from '@zoomus/websdk';
import { useUserType } from '../hooks/useApollo';
import { useParams } from 'react-router-dom';

const zoomCredentials = gql(`
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

    window.onpopstate = (e) => {
        e.preventDefault();
        document.getElementById('zmmtg-root')!.style.display = 'none';
        window.location.reload();
    };
    document.getElementById('zmmtg-root')!.style.display = 'block';

    const userType = useUserType();
    const leaveUrl = type === 'match' ? 'http://localhost:3000/left-chat/match' : 'http://localhost:3000/left-chat/course';
    const role = userType === 'student' ? 1 : 0;
    const { data } = useQuery(zoomCredentials, { variables: { meetingId: id!, role: role } });

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.11.5/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load('de-DE');
    ZoomMtg.i18n.reload('de-DE');

    const credentials = {
        authEndpoint: '',
        sdkKey: 'oy00hCKEQvKyxcR49FzEyw',
        password: '',
        meetingNumber: id!,
        signature: data?.zoomSDKJWT || '',
        userEmail: userType === 'student' ? data?.me.student?.email : data?.me.pupil?.email,
        userName: userType === 'student' ? data?.me.student?.firstname : data?.me.pupil?.firstname,
        leaveUrl: leaveUrl,
        role: role,
        ...(data?.zoomZAK ? { zak: data.zoomZAK } : {}),
    };

    console.log(credentials);

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
