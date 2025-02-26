import { motion } from "framer-motion";
import { useMemo } from "react";

export const AnimatedBubbles = () => {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 8 }).map(() => ({
        size: Math.random() * 50 + 20,
        top: Math.random() * 100, // От 70% до 100% (нижняя треть экрана)
        left: Math.random() * 70 + 40, // От 70% до 100% (правая треть экрана)
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute bg-pink-100 opacity-50 rounded-full"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            top: `${bubble.top}%`,
            left: `${bubble.left}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
          }}
        />
      ))}
    </div>
  );
}
