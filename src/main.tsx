import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import PoweredByGod from './components/appComponents/PoweredByGod.js';
import { init } from '@telegram-apps/sdk-react'

init()

const Root = () => {
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsVisible(true);
  //   }, 2500);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <StrictMode>
      <PoweredByGod />
      {/* {isVisible && <> */}
      <App />
      {/* </>} */}
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
