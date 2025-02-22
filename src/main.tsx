import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

import { init, setMiniAppHeaderColor, setMiniAppBackgroundColor } from '@telegram-apps/sdk-react';
import { setHeaderColor } from 'node_modules/@telegram-apps/sdk/dist/dts/scopes/components/mini-app/methods.js';

init();


setMiniAppBackgroundColor('bg_color')
setMiniAppHeaderColor('bg_color')

if (setHeaderColor.isAvailable() && setHeaderColor.supports.rgb()) {
  setHeaderColor('#ffaabb');
  }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)