import { useQuery } from '@apollo/client';
import { ZoomMtg } from '@zoomus/websdk';
import { Button } from 'native-base';
import { gql } from '../gql';

type MeetingParams = {};

// const zoomCredentials = gql(`query zoom {
//   zoomSDKJWT
//   zoomZAK
// }`);

const ZoomMeeting: React.FC<MeetingParams> = () => {
    // const { data } = useQuery(zoomCredentials);

    async function startMeeting() {
        let meetingSDKElement = document.getElementById('meetingSDKElement');

        ZoomMtg.init({
            leaveUrl: '',
            success: (s: any) => {
                ZoomMtg.join({
                    sdkKey: '', // FROM BE
                    signature: '', // FROM BE
                    meetingNumber: '87975266869',
                    passWord: '',
                    userName: 'Tom',
                    success: (sc: any) => {
                        console.log(sc);
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                });
            },
        });
    }

    return (
        <div className="App">
            <main>
                <h1>Zoom Meeting SDK Sample React</h1>

                <div id="meetingSDKElement">{/* Zoom Meeting SDK Component View Rendered Here */}</div>
                <Button colorScheme="coolGray" onPress={() => startMeeting()}>
                    An Meeting Teilnehmen
                </Button>
            </main>
        </div>
    );
};

export default ZoomMeeting;
