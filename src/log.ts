import { datadogRum } from '@datadog/browser-rum';

export function log(component: string, message: string, ...context: any[]) {
    const line = `[${component}] ${message}`;
    console.log(line, ...context);

    datadogRum.addAction(line);
}

export function logError(component: string, message: string, ...context: any[]) {
    const line = `[${component}] ${message}`;
    console.error(line, ...context);
    datadogRum.addError(line, context);
}

export function debug(component: string, message: string, ...context: any[]) {
    if (process.env.NODE_ENV !== 'production') {
        console.debug(`[${component}] ${message}`, ...context);
    }
}
