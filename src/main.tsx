import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import PoweredByGod from './components/appComponents/PoweredByGod.js';
import { init } from '@telegram-apps/sdk-react'
import { retrieveRawLaunchParams } from '@telegram-apps/sdk-react';


init()

const Root = () => {
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsVisible(true);
  //   }, 2500);

  //   return () => clearTimeout(timer);
  // }, []);

  const [user, setUser] = useState<any>()


  useEffect(() => {
    // Запускаем таймер, чтобы подождать перед получением параметров
    const timer = setTimeout(() => {
      const queryString = retrieveRawLaunchParams();
      const decodedString = decodeURIComponent(queryString);
      const params = new URLSearchParams(decodedString);
      const userJson = params.get('user');
      const user = JSON.parse(decodeURIComponent(userJson as any));

      setUser(user);
    }, 2500); // Таймер на 2.5 секунды

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timer);
  }, []);

  return (
    <StrictMode>
      <PoweredByGod />
      {/* {isVisible && <> */}
      <App user={user} />
      {/* </>} */}
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
