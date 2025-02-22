import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

// import { init, miniApp } from '@telegram-apps/sdk';

import { init, miniApp } from '@telegram-apps/sdk-react';

// const initializeTelegramSDK = async () => {
//   try {
//     await init();


//     if (miniApp.ready.isAvailable()) {
//       await miniApp.ready();
//       console.log('Mini App готово');
//       console.log(miniApp);
//     }


//   } catch (error) {
//     console.error('Ошибка инициализации:', error);
//   }
// };


// initializeTelegramSDK();

init();


miniApp.setHeaderColor('#fcb69f');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)