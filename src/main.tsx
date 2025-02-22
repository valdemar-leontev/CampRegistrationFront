import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { init, miniApp } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  try {
    // Check if the app is running inside Telegram WebApp
    if (!(window as any).Telegram || !(window as any).Telegram.WebApp) {
      console.error("⚠️ Telegram WebApp is not available. Ensure you launch the Mini App inside Telegram.");
      return;
    }

    // Initialize the SDK
    await init();

    // Log the miniApp object for debugging
    console.log("miniApp object:", miniApp);
    console.log("initData:", (window as any).Telegram.WebApp.initData);
    console.log("initDataUnsafe:", (window as any).Telegram.WebApp.initDataUnsafe);

    // Check if the miniApp is ready
    console.log("miniApp.ready.isAvailable():", miniApp.ready.isAvailable());
    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log("✅ Mini App готово");
    } else {
      console.warn("⚠️ miniApp.ready is NOT available.");
    }

  } catch (error) {
    console.error("❌ Ошибка инициализации:", error);
  }
};

const TelegramMiniApp = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initialize Telegram SDK on component mount
    initializeTelegramSDK();

    // Extract user data if available
    if ((window as any).Telegram.WebApp.initDataUnsafe?.user) {
      setUser((window as any).Telegram.WebApp.initDataUnsafe.user);
    } else {
      console.warn("User data not found in initDataUnsafe");
    }
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
