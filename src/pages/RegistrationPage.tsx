import { RegistrationForm } from '@/components/appComponents/registration-form';
import { motion } from "framer-motion";
import { FC } from 'react';

interface IRegistrationPageProps {
  username: string;
}

export const RegistrationPage: FC<IRegistrationPageProps> = ({ username }) => {
  return (
    <motion.div
      className="!min-h-[100%] relative flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-gray-300 opacity-30"
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-gray-300 opacity-30"
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="text-xl font-semibold text-gray-700 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Привет, {username}!
        </motion.div>
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

        <RegistrationForm />
      </motion.div>
    </motion.div>
  );
}
