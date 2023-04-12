import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import { Button } from 'native-base';
import { GestureResponderEvent } from 'react-native';

type MeetingParams = {
    authEndpoint: string;
    meetingNumber: string;
    userName: string;
    sdkKey: string;
    userEmail: string;
    passWord: string;
    registrantToken: string;
    zakToken: string;
    role: number;
};

const ZoomMeeting: React.FC<MeetingParams> = ({ authEndpoint, meetingNumber, userName, sdkKey, userEmail, passWord, registrantToken, zakToken, role }) => {
    const client = ZoomMtgEmbedded.createClient();

    const getSignature = (event: GestureResponderEvent) => {
        event.preventDefault();

        fetch(authEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                meetingNumber: meetingNumber,
                role: role,
            }),
        })
            .then((res) => res.json())
            .then((response) => {
                startMeeting(response.signature);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    function startMeeting(signature: any) {
        let meetingSDKElement = document.getElementById('meetingSDKElement');

        client.init({
            debug: true,
            zoomAppRoot: meetingSDKElement || undefined,
            language: 'en-US',
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
            tk: registrantToken,
            zak: zakToken,
        });
    }

    return (
        <div className="App">
            <main>
                <h1>Zoom Meeting SDK Sample React</h1>

                <div id="meetingSDKElement">{/* Zoom Meeting SDK Component View Rendered Here */}</div>
                <Button colorScheme="coolGray" onPress={(event) => getSignature(event)}>
                    An Meeting Teilnehmen
                </Button>
            </main>
        </div>
    );
};

export default ZoomMeeting;
