// These configurations can both be provided locally,
// but in a server setup /config.js is loaded from the server each time
// injecting a fresh set of RUNTIME_* variables

export const BACKEND_URL = (
    window.liveConfig?.RUNTIME_BACKEND_URL ??
    process.env.REACT_APP_BACKEND_URL
);