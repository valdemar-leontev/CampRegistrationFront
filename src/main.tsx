import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import PoweredByGod from './components/appComponents/PoweredByGod.js';
import { init } from '@telegram-apps/sdk-react'
// import { retrieveRawLaunchParams } from '@telegram-apps/sdk-react';
import { retrieveRawInitData } from '@telegram-apps/bridge';
import { motion } from 'framer-motion';
import { NavigationPanels } from './components/appComponents/navigation-panels.js';
import { useTabStore } from './stores/TabStore.js';
import FAQ from './components/appComponents/faq.js';
import { ProfileBar } from './components/appComponents/profile-bar.js';


init()

const Root = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const [user, setUser] = useState<any>()

  useEffect(() => {
    const timer = setTimeout(() => {
      const queryString = retrieveRawInitData();
      console.log(queryString);


      const decodedString = decodeURIComponent(queryString!);
      const params = new URLSearchParams(decodedString);
      const userJson = params.get('user');
      const user = JSON.parse(decodeURIComponent(userJson as any));

      setUser(user);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const { activeTab } = useTabStore();

  return (
    <StrictMode>
      <PoweredByGod />

      {isVisible && <>
        <ProfileBar user={user} />
        <App user={user} />
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          {activeTab === "Отец и сын" && (
            <div className="">
              <FAQ />
            </div>
          )}
          <NavigationPanels />
        </motion.div>
      </>}
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
