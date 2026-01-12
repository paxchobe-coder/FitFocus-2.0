import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate de que este archivo App.tsx exista en la misma carpeta
import './index.css';    // Importante para que se vea bonito con Tailwind

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
