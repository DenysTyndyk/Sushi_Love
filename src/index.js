import React from 'react';
import { flushSync } from 'react-dom';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootEl = document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);

flushSync(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

rootEl.classList.add('app-ready');
