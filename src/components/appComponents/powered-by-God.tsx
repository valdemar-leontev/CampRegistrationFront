import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiCrossLight } from "react-icons/pi";

const PoweredByGod: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Время показа

    return () => clearTimeout(timer);
  }, []);

  // Генерация частиц
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const size = Math.random() * 10 + 5;
    return (
      <motion.div
        key={i}
        className="absolute rounded-full bg-blue-500"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1.5, 0],
          x: [0, (Math.random() - 0.5) * 200],
          y: [0, (Math.random() - 0.5) * 200],
        }}
        transition={{
          duration: 2,
          delay: Math.random() * 0.5,
          ease: "easeInOut",
          type: "tween"
        }}
      />
    );
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 bg-white flex items-center justify-center z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Частицы фона */}
          {particles}

          <motion.div
            className="relative"
            initial={{ scale: 0.5, rotate: -45 }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.h4
              className="text-black text-5xl font-bold flex flex-row items-center justify-center gap-3 relative z-10"
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: 1,
                y: 0,
                textShadow: [
                  "0 0 0px rgba(0,0,0,0)",
                  "0 0 20px rgba(0,0,0,0.2)",
                  "0 0 5px rgba(0,0,0,0.1)"
                ]
              }}
              transition={{
                duration: 1.2,
                delay: 0.3,
              }}
            >
              <motion.span
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Powered By
              </motion.span>
              <motion.span
                initial={{ scale: 0, rotate: 180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.7,
                  type: "spring",
                  damping: 10,
                  stiffness: 100
                }}
              >
                <PiCrossLight className="text-blue-500" />
              </motion.span>
            </motion.h4>

            <motion.div
              className="absolute inset-0 bg-blue-500 opacity-10 blur-xl rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 2 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </motion.div>

          <motion.p
            className="text-gray-700 text-lg absolute bottom-10 font-light tracking-widest"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Kazan 2025
          </motion.p>

          <motion.div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PoweredByGod;
