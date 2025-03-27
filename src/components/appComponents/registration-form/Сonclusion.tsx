import { motion } from "framer-motion";
import { Typography, Button } from "@mui/material";
import { IoCheckmark } from "react-icons/io5";
import { GiCircle, GiMoneyStack } from "react-icons/gi";
import { FaClock } from "react-icons/fa";
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
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 200, height: 200 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        >
          <GiCircle
            className="w-full h-full text-primary"
            size={150}
            color={isCardPayment ? '#4CAF50' : '#FF9800'}
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.2, type: "spring", stiffness: 150 }}
          className="absolute"
          style={{ width: 100, height: 100 }}
        >
          {isCardPayment ? (
            <IoCheckmark className="w-full h-full text-primary" color='#4CAF50' />
          ) : (
            <div className="relative">
              <GiMoneyStack className="w-full h-full text-primary" color='#FF9800' />
              <FaClock 
                className="absolute -bottom-2 -right-2 text-white bg-amber-600 rounded-full p-1" 
                size={24}
              />
            </div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        {isCardPayment ? (
          <>
            <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
              Ваша регистрация успешно оформлена!
            </Typography>
            <Typography variant="body1" align="center" sx={{ maxWidth: 500, color: "text.secondary" }}>
              Спасибо за вашу заявку! Наш администратор рассмотрит её в течение нескольких дней.
              Мы уведомим вас, как только всё будет готово. Ожидайте уведомления в бота и приложение.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" align="center" sx={{ fontWeight: 600, color: '#FF9800', mb: 2 }}>
              Ожидание подтверждения оплаты
            </Typography>
            
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg shadow-sm w-full max-w-md"
            >
              <div className="flex items-start gap-3">
                <div>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Место зарезервировано
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    Для завершения регистрации необходимо произвести оплату наличными.
                  </Typography>
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Typography variant="body2" sx={{ color: 'amber.800', fontStyle: 'italic' }}>
                      <strong>Обратите внимание:</strong> резерв будет автоматически снят через 7 дней при отсутствии оплаты.
                    </Typography>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-2 text-center max-w-md"
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Мы отправили вам контакты ответственного лица для передачи денежных средств.
              </Typography>
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ 
              mt: 4, 
              px: 6, 
              py: 1.5, 
              borderRadius: 2,
              backgroundColor: isCardPayment ? '#4CAF50' : '#FF9800',
              '&:hover': {
                backgroundColor: isCardPayment ? '#388E3C' : '#F57C00',
              }
            }}
          >
            Понятно
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};