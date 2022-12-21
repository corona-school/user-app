export type WebSocketClient = {
  isConnected: boolean
  onMessage: (callback: (this: WebSocket, ev: MessageEvent) => any) => void
  close: () => void
}

class BrowserWebsocketClient implements WebSocketClient {
  private readonly socket: WebSocket
  public isConnected: boolean = false

  constructor(url: string) {
    this.socket = new WebSocket(url)
    this.socket.onopen = () => {
      this.isConnected = true
    }

    this.socket.onclose = () => {
      this.isConnected = false
    }
  }

  onMessage(callback: (this: WebSocket, ev: MessageEvent) => any) {
    if (!this.socket) {
      // Throw error
      throw new Error('No connection established.')
    }
    this.socket.addEventListener('message', callback)
  }

  close() {
    this.socket.close()
  }
}

// Here the switch could be done between websocket or the react native implementation
const WSClient = BrowserWebsocketClient

export { WSClient }
