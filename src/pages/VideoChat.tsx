import AsNavigationItem from '../components/AsNavigationItem';
import ZoomMeeting from '../components/ZoomMeeting';

const VideoChat: React.FC = () => {
    const authEndpoint = `${process.env.REACT_APP_REACT_APP_BACKEND_URL}`;
    const meetingNumber = `${process.env.REACT_APP_ZOOM_MEETING_NUMBER}`;
    const userName = 'Jon Snow';
    const sdkKey = `${process.env.REACT_APP_REACT_APP_UNSPLASH}`;
    const userEmail = `${process.env.REACT_APP_ZOOM_EMAIL}`;
    const passWord = '';
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
                role={role}
            />
        </AsNavigationItem>
    );
};

export default VideoChat;
