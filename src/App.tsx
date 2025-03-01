import { FC } from 'react';
import './App.css';
import { AccountingPage } from './pages/AccountingPage';
import { useTabStore } from './stores/TabStore';
import { motion } from 'framer-motion';
import FAQ from './components/appComponents/faq';
import { CampInfoPage } from './pages/CampInfoPage';
import { RegistrationPage } from './pages/RegistrationPage';

const App: FC<{ user: any }> = ({ user }) => {

  const { activeTab } = useTabStore();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ delay: 0.5 }}
      className='flex flex-1 mt-20 mb-20 p-4'
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
    </motion.div >
  );
};

export default App;