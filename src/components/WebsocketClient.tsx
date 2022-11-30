import { useEffect, useRef, useContext, FC } from "react"
import { WSClient, WebSocketClient } from '../lib/Websocket'
import { NotificationsContext } from "./NotificationsProvider"
import { getSessionToken, useUserAuth } from "../hooks/useApollo"

export const WebsocketClient: FC = () => {
  const {setConcreteNotificationId} = useContext(NotificationsContext)
  const {sessionState, userId} = useUserAuth()
  const wsClient = useRef<WebSocketClient | null>(null);
  const close = () => {
    wsClient.current?.close()
    wsClient.current = null
  }
  
  useEffect(() => {
    if (sessionState !== 'logged-in' || !userId) {
      close()
      return

    }
    if (!wsClient.current) {
      const propagateMessage = ({ data }: MessageEvent) => {
        const id = JSON.parse(data).concreteNotificationId
        if (typeof id === "number") {
          setConcreteNotificationId(id)
        }
      }
      
      const url = encodeURI(`${process.env.REACT_APP_WEBSOCKET_URL}?id=${userId}&token=${getSessionToken()}`)
      wsClient.current = new WSClient(url);
      wsClient.current.onMessage(propagateMessage);
      
    }
    return close
  }, [sessionState, userId, setConcreteNotificationId]);

  return null;
};