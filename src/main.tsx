import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { init, miniApp } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  try {
    if (typeof (window as any).Telegram === 'undefined' || typeof (window as any).Telegram.WebApp === 'undefined') {
      console.error("⚠️ Telegram WebApp is not available. Ensure you launch the Mini App inside Telegram.");
      return;
    }

    await init();

    if ((window as any).Telegram.WebApp) {
      console.log("initData:", (window as any).Telegram.WebApp.initData);
      console.log("initDataUnsafe:", (window as any).Telegram.WebApp.initDataUnsafe);

      if (miniApp.ready.isAvailable()) {
        await miniApp.ready();
        console.log("✅ Mini App готово");
      } else {
        console.warn("⚠️ miniApp.ready is NOT available.");
      }
    }
  } catch (error) {
    console.error("❌ Ошибка инициализации:", error);
  }
};

const TelegramMiniApp = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    initializeTelegramSDK();

    // Wait for Telegram WebApp data to be available
    setTimeout(() => {
      if ((window as any).Telegram.WebApp.initDataUnsafe?.user) {
        setUser((window as any).Telegram.WebApp.initDataUnsafe.user);
      } else {
        console.warn("User data not found in initDataUnsafe");
      }
    }, 1000);
  }, []);

  return (
    <div>
      <h1>Welcome to the Mini App</h1>
      {user ? (
        <div>
          <p>User: {user.first_name} {user.last_name}</p>
          <p>Username: {user.username}</p>
          <p>ID: {user.id}</p>
        </div>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelegramMiniApp />
  </StrictMode>,
);
