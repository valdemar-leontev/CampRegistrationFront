import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.js';

import { init } from '@telegram-apps/sdk-react';

init();

const AppWrapper = () => {
  // const [user] = useState<any>();

  useEffect(() => {
    console.log(1);
    
    const userData = (window as any).Telegram.WebApp.initData;
    console.log(2);

    console.log(userData);
    console.log(3);
    
  }, []);

  return <App />
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);
