import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import { ZoomMtg } from '@zoomus/websdk';
import { useUserType } from '../hooks/useApollo';

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

type ZoomProps = {
    meetingId: string;
};

const ZoomMeeting: React.FC<ZoomProps> = ({ meetingId }) => {
    window.onpopstate = (e) => {
        e.preventDefault();
        document.getElementById('zmmtg-root')!.style.display = 'none';
        window.location.reload();
    };
    document.getElementById('zmmtg-root')!.style.display = 'block';

    const userType = useUserType();
    const role = userType === 'student' ? 0 : 1;
    const { data } = useQuery(zoomCredentials, { variables: { meetingId: meetingId, role: role } });

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.11.5/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load('de-DE');
    ZoomMtg.i18n.reload('de-DE');

    const credentials = {
        authEndpoint: '',
        sdkKey: 'oy00hCKEQvKyxcR49FzEyw',
        password: '',
        meetingNumber: meetingId,
        signature: data?.zoomSDKJWT || '',
        zak: data?.zoomZAK,
        userEmail: userType === 'student' ? data?.me.student?.email : data?.me.pupil?.email,
        userName: userType === 'student' ? data?.me.student?.firstname : data?.me.pupil?.firstname,
        leaveUrl: 'http://localhost:3000/left-chat',
        role: role,
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
