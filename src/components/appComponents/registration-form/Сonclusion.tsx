import { motion } from "framer-motion";
import { Typography, Button } from "@mui/material";
import { IoCheckmark } from "react-icons/io5";
import { GiCircle, GiMoneyStack } from "react-icons/gi";
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
            color={isCardPayment ? 'green' : 'red'}
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
            <IoCheckmark className="w-full h-full text-primary" color='green' />
          ) : (
            <GiMoneyStack className="w-full h-full text-primary" color='red' />
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
            <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
              Место зарезервировано
            </Typography>
            <div className="bg-red-100 p-6 rounded-2xl shadow-md">
              <Typography variant="h6" className="!font-semibold !mb-3 text-red-800">
                Ваша заявка в статусе "Ожидает Оплаты"
              </Typography>
              <Typography variant="body1" className="text-red-800">
                К сожалению, мы не можем подтвердить ваше присутствие на летнем отдыхе. Но мы зарезервировали место под вас. <br /> <strong className='text-red-700'>Резерв будет снят через неделю автоматически и регистрация будет удалена, при непоступлении оплаты.</strong><br /> Мы вас уведомим.
              </Typography>
            </div>
          </>
        )}

        <Button
          variant="contained"
          onClick={onClose}
          sx={{ mt: 4, px: 6, py: 1.5, borderRadius: 2 }}
        >
          Закрыть
        </Button>
      </motion.div>
    </motion.div>
  );
};