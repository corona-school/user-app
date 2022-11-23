import { useEffect, useRef, useContext} from "react"
import { WSClient, WebSocketClient } from '../types/Websocket'
import { NotificationsContext } from "../hooks/NotificationsProvider"

export const WebsocketClient = () => {
  const {dispatchNewNotificationIds} = useContext(NotificationsContext)
  const ws = useRef<WebSocketClient | null>(null);
  

  useEffect(() => {
    // only for testing
    const wsClient  = new WSClient("wss://ws.kraken.com");

    wsClient.onMessage((event) => {
      console.log("got message", event.data);

      // dummy data
      dispatchNewNotificationIds([Date.now(), Date.now()]);
    });
    
    ws.current = wsClient;

    return () => {
      wsClient.close();
    };
  }, []);

  return null;
};