import { useEffect, useRef, useContext} from "react"
import { NotificationsContext } from "../hooks/NotificationsProvider"

export const WebsocketClient = () => {
  const {dispatchNewNotificationIds} = useContext(NotificationsContext)
  const ws = useRef<WebSocket | null>(null);
  

  useEffect(() => {
    // only for testing
    const socket = new WebSocket("wss://ws.kraken.com");

    socket.onopen = () => {
      console.log("opened");

      // only for testing
      socket.send("{\"event\":\"subscribe\", \"subscription\":{\"name\":\"ticker\"}, \"pair\":[\"BTC/USD\"]}")
    };

    socket.onclose = () => {
      console.log("closed");
    };

    socket.onmessage = (event) => {
      console.log("got message", event.data);
      
      // dummy data
      dispatchNewNotificationIds([Date.now(), Date.now()]);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  return null;
};