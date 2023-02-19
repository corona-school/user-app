import { log, debug } from '../log';

export type WebSocketClient = {
    isConnected: boolean;
    onMessage: (callback: (this: WebSocket, ev: MessageEvent) => any) => void;
    close(code?: number, reason?: string): void;
};

const oneMinuteInMs = 60_000;

class BrowserWebsocketClient implements WebSocketClient {
    private socket: WebSocket | null = null;
    private timerId: number | undefined;
    public isConnected: boolean = false;

    constructor(url: string) {
        this.connect(url);
    }

    onMessage(callback: (this: WebSocket, ev: MessageEvent) => any) {
        if (!this.socket) {
            throw new Error('No connection established.');
        }
        this.socket.addEventListener('message', callback);
    }

    private connect(url: string) {
        if (this.socket !== null) {
            return;
        }
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            this.isConnected = true;
            log('WebSocket', 'Connected!');
            window.clearInterval(this.timerId);
            this.timerId = undefined;

            this.socket!.onclose = (event) => {
                log('WebSocket', 'Connection closed...');
                debug('WebSocket', `Code: ${event.code} - reason: ${event.reason}`);
                this.isConnected = false;
                this.socket = null;

                // try to reconnect after connection was closed abnormally (cf. https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1)
                if (event.code === 1006 && !this.timerId) {
                    this.timerId = window.setInterval(() => {
                        this.connect(url);
                    }, oneMinuteInMs);
                }
            };
        };
    }

    close(code?: number, reason?: string) {
        log('WebSocket', 'Closing connection...');
        this.socket?.close(code, reason);
    }
}

// Here the switch could be done between websocket or the react native implementation
const WSClient = BrowserWebsocketClient;

export { WSClient };
