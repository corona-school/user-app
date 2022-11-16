import { useEffect } from 'react'
import { WebsocketClient } from '../types/Websocket'

const useWebsocketClient = (url: string) => {
  useEffect(() => {
    const ws = new WebsocketClient(url)
  }, [])
}

export { useWebsocketClient }
