import { FC } from 'react';
import './App.css';
import { useTabStore } from './stores/TabStore';
import { motion } from 'framer-motion';
import FAQ from './components/appComponents/faq';
import { CampInfoPage } from './pages/CampInfoPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { MyRegistrationPage } from './pages/MyRegistrationPage';
import { IDataUser } from './models/dto/IDataUser';
import { AdminRegistrationsPage } from './pages/AdminRegistrationsPage';

const App: FC<{ user: IDataUser }> = ({ user }) => {
  const { activeTab } = useTabStore();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ delay: 0.5 }}
      className='p-4 h-[100vh] overflow-hidden'
    >
      {activeTab === "home" && (
        <div className='h-full justify-center flex items-center'>
          <RegistrationPage username={`${user ? user.userName : 'Друг'}`} />
        </div>
      )}

      {activeTab === "accountingPage" && (
        <div>
          <AdminRegistrationsPage />
        </div>
      )}

      {activeTab === "myRequests" && (
        <div>
          <MyRegistrationPage />
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