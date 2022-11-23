export type WebSocketClient = {
  isConnected: boolean
  onMessage: (callback: (this: WebSocket, ev: MessageEvent) => any) => void
  close: () => void
}

class BrowserWebsocketClient implements WebSocketClient {
  private readonly socket: WebSocket
  public isConnected: boolean = false

  // maybe in async connect function
  constructor(url: string) {
    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      this.isConnected = true
      
      // only for testing
      console.log("websocket opened");
      this.socket.send("{\"event\":\"subscribe\", \"subscription\":{\"name\":\"ticker\"}, \"pair\":[\"BTC/USD\"]}")
    };

    this.socket.onclose = () => {
      console.log("websocket closed");
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
