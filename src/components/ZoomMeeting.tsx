import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import { Button } from 'native-base';
import { GestureResponderEvent } from 'react-native';
import { generateSignature } from './zoomMeeting-helper/generate-zoom-signature';

type MeetingParams = {
    authEndpoint: string;
    meetingNumber: string;
    userName: string;
    sdkKey: string;
    userEmail: string;
    passWord: string;
    role: number;
};

const ZoomMeeting: React.FC<MeetingParams> = ({ authEndpoint, meetingNumber, userName, sdkKey, userEmail, passWord, role }) => {
    const client = ZoomMtgEmbedded.createClient();

    const getZakToken = async () => {
        const oAuthRes = await fetch(
            `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_ZOOM_SDK_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_ZOOM_REDIRECT_URL}`,
            {
                mode: 'no-cors',
                headers: {
                    Authorization: 'b3kwMGhDS0VRdkt5eGNSNDlGekV5dzptbU9Xa3Y5ejBzWGdsVGhBVktveGtrMVNIQmhaVHN6Vg==',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        console.log(oAuthRes);
        const accessToken = oAuthRes.body;
        const res = await fetch(`https://api.zoom.us/v2/users/${userEmail}/token?type=zak`, {
            mode: 'no-cors',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(res);
        return res as unknown as string;
    };

    const getNewSignature = (event: GestureResponderEvent) => {
        event.preventDefault();

        generateSignature(process.env.REACT_APP_ZOOM_SDK_CLIENT_ID, process.env.REACT_APP_ZOOM_SDK_CLIENT_SECRET, process.env.REACT_APP_ZOOM_MEETING_NUMBER, 0)
            .then((response: any) => {
                console.log(response);
                startMeeting(response);
            })
            .catch((error: Error) => {
                console.error(error);
            });
    };

    async function startMeeting(signature: any) {
        let meetingSDKElement = document.getElementById('meetingSDKElement');

        client.init({
            debug: true,
            zoomAppRoot: meetingSDKElement || undefined,
            language: 'de-DE',
            customize: {
                meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
                toolbar: {
                    buttons: [
                        {
                            text: 'Custom Button',
                            className: 'CustomButton',
                            onClick: () => {
                                console.log('custom button');
                            },
                        },
                    ],
                },
            },
        });

        client.join({
            signature: signature,
            sdkKey: sdkKey,
            meetingNumber: meetingNumber,
            password: passWord,
            userName: userName,
            userEmail: userEmail,
            zak: await getZakToken(),
        });
    }

    return (
        <div className="App">
            <main>
                <h1>Zoom Meeting SDK Sample React</h1>

                <div id="meetingSDKElement">{/* Zoom Meeting SDK Component View Rendered Here */}</div>
                <Button colorScheme="coolGray" onPress={(event) => getNewSignature(event)}>
                    An Meeting Teilnehmen
                </Button>
            </main>
        </div>
    );
};

export default ZoomMeeting;
