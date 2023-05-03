import AsNavigationItem from '../components/AsNavigationItem';
import ZoomMeeting from '../components/ZoomMeeting';

const VideoChat: React.FC = () => {
    const authEndpoint = `${process.env.REACT_APP_REACT_APP_BACKEND_URL}`;

    return (
        <AsNavigationItem path="video-chat">
            <ZoomMeeting />
        </AsNavigationItem>
    );
};

export default VideoChat;
