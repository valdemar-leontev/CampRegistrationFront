import { FC } from 'react';
import './App.css';
import { AccountingPage } from './pages/AccountingPage';
import { useTabStore } from './stores/TabStore';
import { motion } from 'framer-motion';
import FAQ from './components/appComponents/faq';
import { RegistrationPage } from './pages/RegistrationPage';
import { CampInfoPage } from './pages/CampInfoPage';


const App: FC<{ user: any }> = ({ user }) => {

  const { activeTab } = useTabStore();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ delay: 0.5 }}
      className='bg-green-100 min-h-full'
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
  );
};

export default App;