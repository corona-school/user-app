import { datadogRum } from '@datadog/browser-rum';

// For each device that opens the App, pick a random number [0, 100) and store it in the local storage
// If that number is smaller than the configured 'rollout ratio' the device is chosen to participate in the beta
//
// Thus:
// - If a device was once picked to be in the beta, it stays in the beta (unless the rollout ratio is decreased)
// - The rollout ratio can be gradually increased, i.e. from 10% to 20%
// - A random set of users is chosen per feature toggle
// - Feature toggles are per device, not per user (as doing this per user would be much more complicated)
function betaRollout(name: string, rolloutRatioString: string | undefined) {
    const key = 'lernfair-beta-rollout-' + name;
    let randomString = localStorage.getItem(key);
    if (!randomString) {
        randomString = Math.floor(Math.random() * 100).toString();
        localStorage.setItem(key, randomString);
    }

    let random = parseInt(randomString, 10);
    let rolloutRatio = parseInt(rolloutRatioString ?? '0', 10);

    const chosen = random < rolloutRatio;
    datadogRum.addFeatureFlagEvaluation(name, chosen);

    return chosen;
}

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
export const WEBPUSH_ACTIVE = betaRollout('webpush', window.liveConfig?.RUNTIME_WEBPUSH_ROLLOUT_RATIO);
export const PROMOTE_APP_BANNER_ACTIVE = (window.liveConfig?.RUNTIME_PROMOTE_APP_BANNER_ACTIVE ?? 'false') === 'true';

export const RESULT_CACHE_ACTIVE = (window.liveConfig?.RUNTIME_RESULT_CACHE_ACTIVE ?? 'false') === 'true';
export const SERVICE_WORKER_ACTIVE = (window.liveConfig?.RUNTIME_SERVICE_WORKER_ACTIVE ?? 'false') === 'true';
export const SCHOOL_SEARCH_ACTIVE = (window.liveConfig?.RUN_TIME_SCHOOL_SEARCH_ACTIVE ?? 'false') === 'true';
