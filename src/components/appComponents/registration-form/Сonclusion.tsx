import { motion } from "framer-motion";
import { Typography, Button } from "@mui/material";
import { IoCheckmark } from "react-icons/io5";
import { GiCircle } from "react-icons/gi";
import { PaymentTypeEnum } from '@/models/enums/PaymentTypeEnum';



export const Conclusion = ({ onClose, paymentMethod }: { onClose: () => void, paymentMethod: number }) => {
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
          <GiCircle className="w-full h-full text-primary" size={150} color='green' />
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.2, type: "spring", stiffness: 150 }}
          className="absolute"
          style={{ width: 100, height: 100 }}
        >
          <IoCheckmark className="w-full h-full text-primary" color='green' />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
          Ваша регистрация успешно оформлена!
        </Typography>

        {paymentMethod === PaymentTypeEnum.Card ? <Typography variant="body1" align="center" sx={{ maxWidth: 500, color: "text.secondary" }}>
          Спасибо за вашу заявку! Наш администратор рассмотрит её в течение нескольких дней.
          Мы свяжемся с вами, как только всё будет готово. Ожидайте уведомления на вашу почту или телефон.
        </Typography> :
          <Typography variant="body1" align="center" sx={{ maxWidth: 500, color: "text.secondary" }}>
            Спасибо за вашу заявку! Вы выбрали оплату наличными, передайте полную сумму администратору. Более подробную информацию можете найти на страннице <strong>Мои Регистрации</strong>
          </Typography>}

        <Button
          variant="contained"
          onClick={onClose}
          sx={{ mt: 4, px: 6, py: 1.5, borderRadius: 2 }}
        >
          Закрыть
        </Button>
      </motion.div>
    </motion.div >
  );
};