import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import PoweredByGod from './components/appComponents/powered-by-God.js';
import { init } from '@telegram-apps/sdk-react'
import { retrieveRawInitData } from '@telegram-apps/bridge';
import { NavigationPanels } from './components/appComponents/navigation-panels.js';
import { ProfileBar } from './components/appComponents/profile-bar.js';


import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ITelegramUser } from './models/ITelegramUser.js';
import apiClient from './axios.js';
import { useUserStore } from './stores/UserStore.js';
import { IDataUser } from './models/dto/IDataUser.js';

const theme = createTheme({
  palette: {
    secondary: {
      main: "#4caf50", // Вторичный цвет
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "100px",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
          boxShadow: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
        },
      }
    },
  }
});

export default theme;

try {
  init()
} catch (error) {
  console.log(error);
}

const Root = () => {
  const { user, setUser } = useUserStore();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let telegramUser;

      try {
        const queryString = retrieveRawInitData();
        console.log(queryString);

        const decodedString = decodeURIComponent(queryString!);
        const params = new URLSearchParams(decodedString);
        const userJson = params.get('user');
        telegramUser = JSON.parse(decodeURIComponent(userJson as any)) as ITelegramUser;


        console.log(telegramUser);
      } catch (error) {
        console.log(error);
      }

      const user = await apiClient.post<IDataUser>('users', {
        userName: telegramUser ? telegramUser.username : 'test username',
        firstName: telegramUser ? telegramUser.first_name : 'test first_name',
        lastName: telegramUser ? telegramUser.last_name : 'test last_name',
        telegramId: telegramUser ? String(telegramUser.id) : String(12123),
        phone: telegramUser ? String(telegramUser.phone) : String(8951000000),
        photoUrl: telegramUser ? String(telegramUser.photo_url) : String(8951000000),
      })

      setUser(user.data);
    })()
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <PoweredByGod />
        {isVisible && user && <div className='flex flex-col h-[100vh] overflow-hidden'>
          <ProfileBar user={user} />

          <App user={user} />

          <NavigationPanels />
        </div>}

      </ThemeProvider>

    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
