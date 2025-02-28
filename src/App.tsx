import { FC, useEffect, useState } from 'react';
import './App.css';
import { AccountingPage } from './pages/AccountingPage';
import { NavigationPanels } from './components/appComponents/navigation-panels';
import { useTabStore } from './stores/TabStore';
import { motion } from 'framer-motion';
import FAQ from './components/appComponents/faq';
import { ProfileBar } from './components/appComponents/profile-bar';
import { RegistrationPage } from './pages/RegistrationPage';
import { CampInfoPage } from './pages/CampInfoPage';


const App: FC<{ user: any }> = ({ user }) => {

  const { activeTab } = useTabStore();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='bg-white fixed'>
      {isVisible && <>
        <ProfileBar user={user} />

        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
          className='max-h-[70vh] overflow-auto'
        >
          {activeTab === "home" && (
            <div>
              <RegistrationPage username={`${user ? user.username : 'Друг'}`} />
            </div>
          )}

          {activeTab === "accountingPage" && (
            <div>
              <AccountingPage />
            </div>
          )}

          {activeTab === "info" && (
            <div>
              <CampInfoPage />
            </div>
          )}

          {activeTab === "faq" && (
            <div>
              <FAQ />
            </div>
          )}

        </motion.div>
        <NavigationPanels />
      </>}
    </div >
  );
};

export default App;