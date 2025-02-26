import { motion } from "framer-motion";
import { DrawerRegistration } from '@/components/appComponents/drawer-registration';
import { FC } from 'react';

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
