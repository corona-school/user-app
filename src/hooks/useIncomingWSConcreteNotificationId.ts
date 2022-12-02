import { useEffect, useRef, useState } from "react"
import { WSClient, WebSocketClient } from '../lib/Websocket'
import { getSessionToken, useUserAuth } from "./useApollo"
import { WEBSOCKET_URL } from "../config"

export const useIncomingWSConcreteNotificationId = (): number | null  => {
  const {sessionState, userId} = useUserAuth()
  const [concreteNotificationId, setConcreteNotificationId] = useState<number | null>(null)
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
      const url = encodeURI(`${WEBSOCKET_URL}?id=${userId}&token=${getSessionToken()}`)
      wsClient.current = new WSClient(url);
      wsClient.current.onMessage(({ data }: MessageEvent) => {
        const id = JSON.parse(data).concreteNotificationId
        if (typeof id === "number") {
          setConcreteNotificationId(id)
        }
      });
      
    }
    return close
  }, [sessionState, userId, setConcreteNotificationId]);

  return concreteNotificationId;
}
