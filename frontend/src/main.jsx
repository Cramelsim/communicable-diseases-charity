import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import App from './App';
import { store } from './app/store';
import { loadCurrentUser } from './features/auth/authSlice';
import './index.css';

store.dispatch(loadCurrentUser());

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </Provider>
);
