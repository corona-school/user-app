import { useEffect, useRef, useContext, FC } from "react"
import { WSClient, WebSocketClient } from '../types/Websocket'
import { NotificationsContext } from "../hooks/NotificationsProvider"

const dummyNotification = {
  id: 1,
  headline: 'Du hast ein neues Match',
  createdAt: '2022-11-21T14:08:35.539Z',
  notification: { messageType: 'match' }
}

export const WebsocketClient: FC<{}> = () => {
  const {setNotificationIds, setNotifications} = useContext(NotificationsContext)
  const ws = useRef<WebSocketClient | null>(null);
  

  useEffect(() => {
    // only for testing
    const wsClient  = new WSClient("wss://ws.kraken.com");

    wsClient.onMessage((event) => {
      console.log("got message", event.data);

      // dummy data
      setNotifications([{...dummyNotification, body: event.data}]);
    });
    
    ws.current = wsClient;

    return () => {
      wsClient.close();
    };
  }, []);

  return null;
};