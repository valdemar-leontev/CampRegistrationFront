import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import PoweredByGod from './components/appComponents/PoweredByGod.js';
import { init } from '@telegram-apps/sdk-react'
import { retrieveRawInitData } from '@telegram-apps/bridge';


init()

const Root = () => {
  const [user, setUser] = useState<any>()

  useEffect(() => {
    const queryString = retrieveRawInitData();
    console.log(queryString);

    const decodedString = decodeURIComponent(queryString!);
    const params = new URLSearchParams(decodedString);
    const userJson = params.get('user');
    const user = JSON.parse(decodeURIComponent(userJson as any));

    setUser(user);
  }, []);


  return (
    <StrictMode>
      <PoweredByGod />

      <App user={user} />

    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
