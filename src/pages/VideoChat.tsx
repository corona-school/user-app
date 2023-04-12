import AsNavigationItem from '../components/AsNavigationItem';
import ZoomMeeting from '../components/ZoomMeeting';

const VideoChat: React.FC = () => {
    const authEndpoint = '';
    const meetingNumber = '';
    const userName = '';
    const sdkKey = `${process.env.REACT_APP_UNSPLASH}`;
    const userEmail = '';
    const passWord = '';
    const registrantToken = '';
    const zakToken = '';
    const role = 0;

    return (
        <AsNavigationItem path="video-chat">
            <ZoomMeeting
                authEndpoint={authEndpoint}
                meetingNumber={meetingNumber}
                userName={userName}
                sdkKey={sdkKey}
                userEmail={userEmail}
                passWord={passWord}
                registrantToken={registrantToken}
                zakToken={zakToken}
                role={role}
            />
        </AsNavigationItem>
    );
};

export default VideoChat;
