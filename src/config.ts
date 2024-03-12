// These configurations can both be provided locally,
// but in a server setup /config.js is loaded from the server each time
// injecting a fresh set of RUNTIME_* variables

export const BACKEND_URL = window.liveConfig?.RUNTIME_BACKEND_URL ?? process.env.REACT_APP_BACKEND_URL;

export const APP_VERSION = window.liveConfig?.RUNTIME_APP_VERSION ?? process.env.REACT_APP_VERSION;

export const DISABLE_MATOMO = window.liveConfig?.RUNTIME_DISABLE_MATOMO ?? process.env.REACT_APP_DISABLE_MATOMO;

export const WEBSOCKET_URL = window.liveConfig?.RUNTIME_WEBSOCKET_URL ?? process.env.REACT_APP_WEBSOCKET_URL;

export const DEACTIVATE_PUPIL_MATCH_REQUESTS =
    window.liveConfig?.RUNTIME_DEACTIVATE_PUPIL_MATCH_REQUESTS ?? process.env.REACT_APP_DEACTIVATE_PUPIL_MATCH_REQUESTS;

export const ZOOM_MEETING_SDK_KEY = process.env.REACT_APP_ZOOM_SDK_KEY;

export const DD_APP_ID = window.liveConfig?.RUNTIME_DD_APP_ID ?? process.env.REACT_APP_DD_APP_ID;
export const DD_CLIENT_TOKEN = window.liveConfig?.RUNTIME_DD_CLIENT_TOKEN ?? process.env.REACT_APP_DD_CLIENT_TOKEN;
export const DD_ENV = window.liveConfig?.RUNTIME_DD_ENV ?? process.env.REACT_APP_DD_ENV;

export const TALKJS_APP_ID = window.liveConfig?.RUNTIME_TALKJS_APP_ID ?? process.env.REACT_APP_TALKJS_APP_ID;

export const GAMIFICATION_ACTIVE = (window.liveConfig?.RUNTIME_GAMIFICATION_ACTIVE ?? 'false') === 'true';
