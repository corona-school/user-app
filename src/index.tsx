import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './I18n';
const root = document.getElementById('root');

console.log('LernFair Web App Version', `${process.env.REACT_APP_VERSION}`);

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
