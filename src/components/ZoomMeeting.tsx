import { useQuery } from '@apollo/client';
import { Button } from 'native-base';
import { gql } from '../gql';
import { ZoomMtg } from '@zoomus/websdk';
import { useUserType } from '../hooks/useApollo';

type MeetingParams = {};

const zoomCredentials = gql(`
query zoom($role: Float!) {
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
    zoomSDKJWT (role: $role)
}`);

const ZoomMeeting: React.FC<MeetingParams> = () => {
    const userType = useUserType();
    const role = userType === 'student' ? 0 : 1;
    const { data } = useQuery(zoomCredentials, { variables: { role: role } });

    console.log('DATA', data);
    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.11.5/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load('de-DE');
    ZoomMtg.i18n.reload('de-DE');

    const credentials = {
        authEndpoint: '',
        sdkKey: 'oy00hCKEQvKyxcR49FzEyw',
        password: '',
        meetingNumber: '81805946306',
        signature: data?.zoomSDKJWT || '',
        zak: data?.zoomZAK,
        userEmail: userType === 'student' ? data?.me.student?.email : data?.me.pupil?.email,
        userName: userType === 'student' ? data?.me.student?.firstname : data?.me.pupil?.firstname,
        leaveUrl: 'http://localhost:3000/left-chat',
        role: role,
    };

    async function startMeeting() {
        document.getElementById('zmmtg-root')!.style.display = 'block';

        ZoomMtg.init({
            leaveUrl: credentials.leaveUrl,
            success: (success: any) => {
                console.log(success);
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
    }

    return (
        <div className="App">
            <main>
                <h1>Zoom Meeting SDK Sample React</h1>
                <Button colorScheme="coolGray" onPress={() => startMeeting()}>
                    An Meeting Teilnehmen
                </Button>
            </main>
        </div>
    );
};

export default ZoomMeeting;
