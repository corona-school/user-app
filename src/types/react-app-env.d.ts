/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
    interface LernFairEnv {
        // App version dynamically fetched by the environment
        readonly REACT_APP_VERSION: string;
        // Pointing to a running instance of corona-school/backend
        readonly REACT_APP_BACKEND_URL: string;
        // Websocket Server URL
        readonly REACT_APP_WEBSOCKET_URL: string;
        // Matomo API Key
        readonly REACT_APP_MATOMO_URL: string;
        readonly REACT_APP_DISABLE_MATOMO?: 'true';
        // Unsplash API Key
        readonly REACT_APP_UNSPLASH: string;
        // URL for student screenings
        readonly REACT_APP_SCREENING_URL: string;
    }
    interface ProcessEnv extends LernFairEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly PUBLIC_URL: string;
    }
}

declare interface Window {
    readonly liveConfig: {
        readonly RUNTIME_BACKEND_URL: string;
        readonly RUNTIME_WEBSOCKET_URL: string;
        readonly RUNTIME_DISABLE_MATOMO?: 'true' | 'false';
    };
}

declare module '*.avif' {
    const src: string;
    export default src;
}

declare module '*.bmp' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

    const src: string;
    export default ReactComponent;
}
