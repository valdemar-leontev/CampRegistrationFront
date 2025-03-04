import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
// import PoweredByGod from './components/appComponents/powered-by-God.js';
import { init } from '@telegram-apps/sdk-react'
import { retrieveRawInitData } from '@telegram-apps/bridge';
import { NavigationPanels } from './components/appComponents/navigation-panels.js';
import { ProfileBar } from './components/appComponents/profile-bar.js';


import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // primary: {
    //   main: "blue-100", // Основной цвет
    // },
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
  const [user, setUser] = useState<any>()

  useEffect(() => {
    try {
      const queryString = retrieveRawInitData();
      console.log(queryString);

      const decodedString = decodeURIComponent(queryString!);
      const params = new URLSearchParams(decodedString);
      const userJson = params.get('user');
      const user = JSON.parse(decodeURIComponent(userJson as any));

      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        {/* <PoweredByGod /> */}
        <div className='flex flex-col h-[100vh] overflow-hidden'>
          <ProfileBar user={user} />

          <App user={user} />

          <NavigationPanels />
          {/* <div className='bg-red-100 flex-[1]'></div>

          <div className='bg-red-300 flex-[4]'></div>

          <div className='bg-red-600 flex-[1]'></div> */}
        </div>

      </ThemeProvider>

    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
