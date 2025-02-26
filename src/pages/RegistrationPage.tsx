import { motion } from "framer-motion";
import { DrawerRegistration } from '@/components/appComponents/drawer-registration';
import { FC } from 'react';

const randomScale = () => Math.random() * (1.5 - 1) + 1;

interface IRegistrationPageProps {
  username: string;
}

export const RegistrationPage: FC<IRegistrationPageProps> = ({ username }) => {
  return (
    <motion.div
      className="min-h-[70vh] bg-white relative flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute w-32 h-32 bg-[#e7fe55] rounded-full opacity-60"
        initial={{ left: "50%", top: "50%" }}
        animate={{
          left: ["50%", `${Math.random() * 100}%`],
          top: ["50%", `${Math.random() * 100}%`],
          scale: [1, randomScale(), 1],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 2,
        }}
      />

      <motion.div
        className="absolute w-48 h-48 bg-pink-300 rounded-full opacity-60"
        initial={{ left: "50%", top: "50%" }}
        animate={{
          left: ["50%", `${Math.random() * 100}%`],
          top: ["50%", `${Math.random() * 100}%`],
          scale: [1, randomScale(), 1],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 2,
        }}
      />

      <motion.div
        className="absolute w-40 h-40 bg-[#f4fdbb] rounded-full opacity-60"
        initial={{ left: "50%", top: "50%" }}
        animate={{
          left: ["50%", `${Math.random() * 100}%`],
          top: ["50%", `${Math.random() * 100}%`],
          scale: [1, randomScale(), 1],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 2,
        }}
      />

      <motion.div
        className="absolute w-56 h-56 bg-pink-200 rounded-full opacity-60"
        initial={{ left: "50%", top: "50%" }}
        animate={{
          left: ["50%", `${Math.random() * 100}%`],
          top: ["50%", `${Math.random() * 100}%`],
          scale: [1, randomScale(), 1],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 2,
        }}
      />

      <motion.div
        className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Привет, {username}!
      </motion.div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Регистрация на Лагерь
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Присоединяйтесь к нашему лагерю! Пожалуйста, заполните форму ниже, чтобы зарегистрироваться.
        </motion.p>

        <DrawerRegistration />
      </motion.div>
    </motion.div>
  );
}
