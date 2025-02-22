import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.js';
import { init, miniApp } from '@telegram-apps/sdk';

const TelegramApp = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
          setUser(userData); // Обновляем состояние
        } else {
          console.warn('Данные о пользователе недоступны');
        }
      } catch (error) {
        console.error('Ошибка инициализации:', error);
      }
    };

    initializeTelegramSDK();
  }, []);

  return (
    <StrictMode>
      <div>
        <h1>Данные пользователя:</h1>
        {user ? (
          <pre>{JSON.stringify(user, null, 2)}</pre>
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<TelegramApp />);
