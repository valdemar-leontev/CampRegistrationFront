import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
// import PoweredByGod from './components/appComponents/powered-by-God.js';
import { init } from '@telegram-apps/sdk-react'
import { retrieveRawInitData } from '@telegram-apps/bridge';
import { NavigationPanels } from './components/appComponents/navigation-panels.js';
import { ProfileBar } from './components/appComponents/profile-bar.js';


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
      {/* <PoweredByGod /> */}

      <ProfileBar user={user} />

      <App user={user} />

      <NavigationPanels />

    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
