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
        // URL for student screenings
        readonly REACT_APP_SCREENING_URL: string;
        // URL for pupil screenings
        readonly REACT_APP_PUPIL_SCREENING_URL: string;
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
        readonly RUNTIME_DEACTIVATE_PUPIL_MATCH_REQUESTS?: 'true' | 'false';
        readonly RUNTIME_APP_VERSION: string;
        readonly RUNTIME_DD_APP_ID: string;
        readonly RUNTIME_DD_CLIENT_TOKEN: string;
        readonly RUNTIME_DD_ENV: string;
        readonly RUNTIME_TALKJS_APP_ID: string;
        readonly RUNTIME_GAMIFICATION_ACTIVE?: 'true' | 'false';
        readonly RUNTIME_RESULT_CACHE_ACTIVE?: 'true' | 'false';
        readonly RUNTIME_SERVICE_WORKER_ACTIVE?: 'true' | 'false';
        readonly RUNTIME_PROMOTE_APP_BANNER_ACTIVE?: 'true' | 'false';
        readonly RUNTIME_SCHOOL_SEARCH_ACTIVE?: 'true' | 'false';
        readonly RUNTIME_PUPIL_FIRST_SCREENING_URL: string;
        readonly RUNTIME_PUPIL_SCREENING_URL: string;
        readonly RUNTIME_SCREENING_URL: string;
        readonly RUNTIME_SHARING_MATERIALS_URL: string;
        readonly RUNTIME_GOOGLE_CLIENT_ID: string;
        readonly RUNTIME_REFERRALS_ACTIVE: string;
        readonly RUNTIME_LESSON_PLAN_GENERATOR_ACTIVE: string;
        readonly RUNTIME_HOMEWORK_HELP_COURSE: string;
        readonly RUNTIME_TEST_STUDENT_ID: string;

        readonly RUNTIME_WEBPUSH_ROLLOUT_RATIO?: string;
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
