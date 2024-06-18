import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './I18n';
import { datadogRum } from '@datadog/browser-rum';
import { APP_VERSION, DD_APP_ID, DD_CLIENT_TOKEN, DD_ENV } from './config';
import { getSessionToken } from './hooks/useApollo';

const root = document.getElementById('root');

console.log('LernFair Web App Version', APP_VERSION);

datadogRum.init({
    applicationId: DD_APP_ID,
    clientToken: DD_CLIENT_TOKEN,
    site: 'datadoghq.eu',
    service: 'user-app',
    env: DD_ENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: APP_VERSION,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    traceSampleRate: 100,
    defaultPrivacyLevel: 'mask',
    allowedTracingUrls: [/https?:\/\/.*\.(lern-fair|corona-school|herokuapp)\.(de|com)/],
    beforeSend: (event) => {
        if (event.view.url.includes('token=')) {
            event.view.url = event.view.url.replace(/token=([^&]*)/, 'token=***');
        }
        return true;
    },
    enableExperimentalFeatures: ['feature_flags'],
});

// This will make sure that we are setting the session token for the user right in the beginning.
// Otherwise, we might miss some events.
datadogRum.setGlobalContextProperty('sessionToken', getSessionToken());

// Records the DOM the users sees, to be able to "watch" what happened in a User Session (and fix UI bugs)
datadogRum.startSessionReplayRecording();
console.log('Session Replay', datadogRum.getSessionReplayLink());

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// process.env.NODE_ENV === 'development' && reportWebVitals(console.log)
