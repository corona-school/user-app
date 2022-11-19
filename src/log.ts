
class LogBuffer {
    buffer: string[];
    index = 0;

    constructor(public readonly size: number) {
        this.buffer = Array.from({ length: size }, () => "");
    }

    write(line: string) {
        this.buffer[this.index] = line;
        this.index = (this.index + 1) % this.buffer.length;
    }

    read() {
        return [...this.buffer.slice(this.index), ...this.buffer.slice(0, this.index)].filter(it => it.length);
    }
}

const logBuffer = new LogBuffer(20);
export const getLastLogs = () => logBuffer.read();

export function log(component: string, message: string, ...context: any[]) {
    const line = `[${component}] ${message}`;
    console.log(line, ...context);
    logBuffer.write(line);
}