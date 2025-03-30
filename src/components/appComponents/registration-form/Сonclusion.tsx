import { motion } from "framer-motion";
import { Typography, Button, Alert } from "@mui/material";
import { IoCheckmark } from "react-icons/io5";
import { GiCircle } from "react-icons/gi";
import { PaymentTypeEnum } from '@/models/enums/PaymentTypeEnum';

export const Conclusion = ({ onClose, paymentMethod }: { onClose: () => void, paymentMethod: number }) => {
  const isCardPayment = paymentMethod === PaymentTypeEnum.Card;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full gap-6"
    >
      {/* Анимация зеленой галочки */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 200, height: 200 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        >
          <GiCircle className="w-full h-full text-primary" size={150} color="#4CAF50" />
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.2, type: "spring", stiffness: 150 }}
          className="absolute"
          style={{ width: 100, height: 100 }}
        >
          <IoCheckmark className="w-full h-full text-primary" color="#4CAF50" />
        </motion.div>
      </motion.div>

      {/* Основной текст */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center max-w-md"
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
          Ваша регистрация успешно оформлена!
        </Typography>

        <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
          {isCardPayment ? (
            "Спасибо за вашу заявку! Наш администратор рассмотрит её в течение нескольких дней."
          ) : (
            "Для завершения регистрации необходимо произвести оплату наличными."
          )}
        </Typography>

        {/* Компактная плашка для наличной оплаты */}
        {!isCardPayment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full mt-2"
          >
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Обратите внимание:</strong> заявка будет автоматически отменена через 7 дней при отсутствии оплаты.
              </Typography>
            </Alert>
          </motion.div>
        )}

        <Typography variant="body1" align="center" sx={{ color: "text.secondary", mt: 1 }}>
          {isCardPayment ? (
            "Мы уведомим вас, как только всё будет готово. Ожидайте уведомления в бота и приложение."
          ) : (
            "Мы отправили вам контакты ответственного лица для передачи денежных средств."
          )}
        </Typography>
      </motion.div>

      {/* Кнопка */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ 
            mt: 2, 
            px: 6, 
            py: 1.5, 
            borderRadius: 2,
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#388E3C',
            }
          }}
        >
          Понятно
        </Button>
      </motion.div>
    </motion.div>
  );
};