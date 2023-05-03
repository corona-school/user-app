import { useQuery } from '@apollo/client';
import { Button } from 'native-base';
import { gql } from '../gql';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

type MeetingParams = {};

const zoomCredentials = gql(`
query zoom {
    zoomSDKJWT (role: 1)
    zoomZAK
}`);

const ZoomMeeting: React.FC<MeetingParams> = () => {
    const { data } = useQuery(zoomCredentials);
    const client = ZoomMtgEmbedded.createClient();

    async function startMeeting() {
        let meetingSDKElement = document.getElementById('meetingSDKElement');

        client.init({
            debug: true,
            zoomAppRoot: meetingSDKElement || undefined,
            language: 'de-DE',
        });
        client.join({
            signature: data?.zoomSDKJWT || '',
            sdkKey: 'jSQWqYJdRb-Q1eA7OtUoTg',
            meetingNumber: '87975266869',
            password: '',
            userName: 'Lomy',
            userEmail: 'salome.wick@typedigital.de',
            zak: data?.zoomZAK,
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
