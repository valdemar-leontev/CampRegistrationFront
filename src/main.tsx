import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
// import PoweredByGod from './components/appComponents/powered-by-God.js';
// import { init } from '@telegram-apps/sdk-react'
// import { retrieveRawInitData } from '@telegram-apps/bridge';
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
          borderRadius: "100px",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
          boxShadow: "none",
        },
      }
    },
  }
});

export default theme;

// init()

const Root = () => {
  const [user, _] = useState<any>()

  // useEffect(() => {
  //   const queryString = retrieveRawInitData();
  //   console.log(queryString);

  //   const decodedString = decodeURIComponent(queryString!);
  //   const params = new URLSearchParams(decodedString);
  //   const userJson = params.get('user');
  //   const user = JSON.parse(decodeURIComponent(userJson as any));

  //   setUser(user);
  // }, []);

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        {/* <PoweredByGod /> */}
        <div className='flex flex-col h-[95vh]'>
          <ProfileBar user={user} />

          <App user={user} />

          <NavigationPanels />
        </div>

      </ThemeProvider>

    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
