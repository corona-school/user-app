import { useEffect, useRef, useContext, FC } from "react"
import { WSClient, WebSocketClient } from '../types/Websocket'
import { NotificationsContext } from "../hooks/NotificationsProvider"
import { useUserAuth } from "../hooks/useApollo"

const dummyNotification = {
  id: 1,
  headline: 'Du hast ein neues Match',
  createdAt: '2022-11-21T14:08:35.539Z',
  notification: { messageType: 'match' }
}

export const WebsocketClient: FC<{}> = () => {
  const {setNotificationIds, setNotifications} = useContext(NotificationsContext)
  const {sessionState, userId, getSessionToken} = useUserAuth()
  const ws = useRef<WebSocketClient | null>(null);

  const wsClient = new WSClient()

  useEffect(() => {
    if (sessionState !== 'logged-in') {
      wsClient.close()
      
      return
    }
    
    // only for testing
    //wsClient.connect("wss://ws.kraken.com");
    
    const host = 'wss://ws.localhost:5000'
    const url = `${host}?id="${userId}"&token="${getSessionToken()}"`
    wsClient.connect(url);

    wsClient.onMessage((event) => {

      // dummy data
      setNotifications([{...dummyNotification, body: event.data}]);
    });
    
    ws.current = wsClient;

    return () => {
      wsClient.close();
    };
  }, [sessionState]);

  return null;
};