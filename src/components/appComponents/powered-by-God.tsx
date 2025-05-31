import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiCrossLight } from "react-icons/pi";

const PoweredByGod: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const particles = Array.from({ length: 25 }).map((_, i) => {
    const size = Math.random() * 8 + 4;
    const blueShade = `rgba(100, 150, 255, ${Math.random() * 0.4 + 0.2})`;
    
    return (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: blueShade,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.6, 0],
          scale: [0, 1.2, 0],
        }}
        transition={{
          duration: 3,
          delay: Math.random() * 1,
          ease: "easeInOut",
        }}
      />
    );
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-white/95 flex items-center justify-center z-[9999] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {particles}

          <motion.div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, #4a8bfc 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
          >
            <motion.h4
              className="text-slate-800 text-5xl md:text-6xl font-bold flex flex-row items-center justify-center gap-4 relative z-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
            >
              <motion.span
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"
              >
                Powered By
              </motion.span>
              <motion.span
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.7,
                  type: "spring",
                  stiffness: 150
                }}
              >
                <PiCrossLight className="text-blue-600" size={50} />
              </motion.span>
            </motion.h4>

            <motion.div
              className="absolute -inset-4 -z-10 bg-blue-100 rounded-full blur-xl opacity-70"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 3, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.div>

          <motion.p
            className="text-slate-600 text-lg md:text-xl absolute bottom-16 font-medium tracking-wider"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Kazan 2025
          </motion.p>

          <motion.div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PoweredByGod;