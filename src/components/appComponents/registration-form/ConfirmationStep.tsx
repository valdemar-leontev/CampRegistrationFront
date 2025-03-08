import { Typography, Button } from "@mui/material";

interface ConfirmationStepProps {
  onClose: () => void;
}

export const ConfirmationStep = ({ onClose }: ConfirmationStepProps) => {
  return (
    <div className="text-left bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <Typography variant="h5" className="text-xl font-semibold text-gray-900 !mb-3">
        Оплата на подтверждении
      </Typography>
      <Typography variant="body1" className="!mb-4">
        Спасибо за регистрацию! Ваша оплата находится на проверке. Администратор подтвердит её в
        течение нескольких дней.
      </Typography>
      <Typography variant="body2" className="text-gray-600 !mb-4">
        Если у вас возникнут вопросы, свяжитесь с нами по телефону или через электронную почту.
      </Typography>
      <Button
        variant="contained"
        onClick={onClose}
        className="!bg-blue-500 !text-white"
      >
        Закрыть
      </Button>
    </div>
  );
};