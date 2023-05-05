import { Box } from 'native-base';
import ChatboxHeader from './ChatboxHeader';
import ChatBox from './ChatBox';

const UserChat = () => {
    return (
        <div className="chatbox-container">
            <ChatboxHeader />
            <ChatBox />
        </div>
    );
};

export default UserChat;
