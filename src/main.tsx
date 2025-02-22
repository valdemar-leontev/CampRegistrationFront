import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

import { init, miniApp } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App готово');
    }

    // Получаем информацию о пользователе
    const userData = (miniApp as any).initDataUnsafe?.user;
    if (userData) {
      console.log('Пользователь:', userData);
    } else {
      console.warn('Данные о пользователе недоступны');
    }

  } catch (error) {
    console.error('Ошибка инициализации:', error);
  }
};



initializeTelegramSDK();

// miniApp.setHeaderColor('#fcb69f');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)