// These configurations can both be provided locally,
// but in a server setup /config.js is loaded from the server each time
// injecting a fresh set of RUNTIME_* variables

export const BACKEND_URL = window.liveConfig?.RUNTIME_BACKEND_URL ?? process.env.REACT_APP_BACKEND_URL;

export const DISABLE_MATOMO = window.liveConfig?.RUNTIME_DISABLE_MATOMO ?? process.env.REACT_APP_DISABLE_MATOMO;

export const WEBSOCKET_URL = window.liveConfig?.RUNTIME_WEBSOCKET_URL ?? process.env.REACT_APP_WEBSOCKET_URL;

export const DEACTIVATE_PUPIL_MATCH_REQUESTS =
    window.liveConfig?.RUNTIME_DEACTIVATE_PUPIL_MATCH_REQUESTS ?? process.env.REACT_APP_DEACTIVATE_PUPIL_MATCH_REQUESTS;

export const ZOOM_MEETING_SDK_KEY = 'oy00hCKEQvKyxcR49FzEyw';
