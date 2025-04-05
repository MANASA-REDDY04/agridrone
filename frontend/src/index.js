import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register service worker for PWA support
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/serviceWorker.js')
        .then(registration => {
          console.log('Service Worker registered: ', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed: ', error);
        });
    });
  }
};

// Call the function to register
registerServiceWorker();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
