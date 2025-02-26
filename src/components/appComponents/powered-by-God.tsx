import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiCrossLight } from "react-icons/pi";

const PoweredByGod: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 bg-white flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.h4
            className="text-black text-4xl font-bold flex flex-row items-center justify-center gap-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: [0, 1, 10],
            }}
            exit={{ opacity: 0, scale: 10 }}
            transition={{
              duration: 1,
              ease: ["easeInOut", "easeInOut", "easeOut"],
              times: [0, 1, 10], 
            }}
          >
            Powered By <PiCrossLight />
          </motion.h4>
          <motion.p
            className="text-gray-500 text-sm absolute bottom-5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Kazan 2025
          </motion.p>
        </motion.div>
      )
      }
    </AnimatePresence >
  );
};

export default PoweredByGod;
