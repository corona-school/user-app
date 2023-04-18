import { datadogLogs, HandlerType } from '@datadog/browser-logs';

datadogLogs.init({
    clientToken: process.env.REACT_APP_DATADOG_APP_KEY,
    site: 'datadoghq.eu',
    forwardErrorsToLogs: true,
    forwardConsoleLogs: [],
    sessionSampleRate: 100,
    env: process.env.NODE_ENV,
    service: 'user-app',
    useSecureSessionCookie: process.env.NODE_ENV === 'production',
});

let handler: HandlerType[] = ['console'];
if (process.env.NODE_ENV === 'production') {
    handler = ['console', 'http'];
}
datadogLogs.logger.setHandler(handler);

class LogBuffer {
    buffer: string[];
    index = 0;

    constructor(public readonly size: number) {
        this.buffer = Array.from({ length: size }, () => '');
    }

    write(line: string) {
        this.buffer[this.index] = line;
        this.index = (this.index + 1) % this.buffer.length;
    }

    read() {
        return [...this.buffer.slice(this.index), ...this.buffer.slice(0, this.index)].filter((it) => it.length);
    }
}

const logBuffer = new LogBuffer(20);
export const getLastLogs = () => logBuffer.read();

export function log(component: string, message: string, ...context: any[]) {
    const line = `[${component}] ${message}`;
    logBuffer.write(line);
    datadogLogs.logger.info(message, { categoryName: component, data: context });
}

export function logError(component: string, err: Error, data: { [key: string]: any }) {
    datadogLogs.logger.error(err.message, { categoryName: component, data }, err);
}

export function debug(component: string, message: string, ...context: any[]) {
    if (process.env.NODE_ENV !== 'production') {
        console.debug(`[${component}] ${message}`, ...context);
    }
}
