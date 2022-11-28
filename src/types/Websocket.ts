export type WebSocketClient = {
  isConnected: boolean
  connect: (url: string) => void
  onMessage: (callback: (this: WebSocket, ev: MessageEvent) => any) => void
  close: () => void
}

class BrowserWebsocketClient implements WebSocketClient {
  private socket: WebSocket | undefined
  public isConnected: boolean = false

  // maybe in async connect function
  connect(url: string) {
    if (this.isConnected) this.close()
    
    this.socket = new WebSocket(url)
    this.socket.onopen = () => {
      this.isConnected = true
      
      // only for testing
      console.log("websocket opened");
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
    this.socket?.close()
    this.socket = undefined
  }
}

// Here the switch could be done between websocket or the react native implementation
const WSClient = BrowserWebsocketClient

export { WSClient }
