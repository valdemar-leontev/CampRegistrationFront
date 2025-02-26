import { FC, useEffect, useState } from 'react';
import './App.css';
import { AccountingPage } from './pages/AccountingPage';
import { NavigationPanels } from './components/appComponents/navigation-panels';
import { useTabStore } from './stores/TabStore';
import { motion } from 'framer-motion';
import FAQ from './components/appComponents/faq';
import { ProfileBar } from './components/appComponents/profile-bar';
import { RegistrationPage } from './pages/RegistrationPage';



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
    <div className='bg-white'>
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
              <RegistrationPage username={`${user.first_name} ${user.last_name} ${user.username}`} />
            </div>
          )}

          {activeTab === "accountingPage" && (
            <div>
              <AccountingPage />
            </div>
          )}
          {activeTab === "faq" && (
            <div>
              <FAQ />
            </div>
          )}

          <NavigationPanels />
        </motion.div>
      </>}
    </div >
  );
};

export default App;