type WebSocketClient = {
  isConnected: boolean
  onMessage: (callback: (this: WebSocket, ev: MessageEvent) => any) => void
}

class BrowserWebsocketClient implements WebSocketClient {
  private socket: WebSocket
  public isConnected: boolean = false

  // maybe in async connect function
  constructor(url: string) {
    this.socket = new WebSocket(url)
    this.isConnected = true
  }
  onMessage(callback: (this: WebSocket, ev: MessageEvent) => any) {
    if (!this.socket) {
      // Throw error
      throw new Error('No connection established.')
    }
    this.socket.addEventListener('message', callback)
  }

  closeConnection() {}
}

// Here the switch could be done between websocket or the react native implementation
const WebsocketClient = BrowserWebsocketClient

export { WebsocketClient }
